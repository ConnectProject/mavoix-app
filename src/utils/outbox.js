import Parse from 'parse'

import { get, getAll, put, remove } from '~/utils/offlineDb'

/*
 * Messages for the server (usage recording, Connect data sharing) that could not be sent yet.
 * enqueue() stores a message in IndexedDB and tries to send it at once; flush() sends everything that is waiting,
 * in order, and stops at the first message that fails because of the network. The messages that stay are sent at
 * the next trigger (see boot/offline.js: connection back, app visible again, every minute).
 * A message with a `key` replaces the waiting message with the same key (used to keep only the latest session end).
 */
const handlers = {}
let flushing = null

/**
 * @param {string} type message type
 * @param {function(Object): Promise} handler sends the data of a message of that type; rejects when it fails
 */
export const registerHandler = (type, handler) => {
  handlers[type] = handler
}

const currentAccount = () => (Parse.User.current() ? Parse.User.current().id : null)

/**
 * @param {Error} err error of a handler
 * @returns {boolean} true when sending again later can work (network, server down, expired token)
 */
const isRetryable = (err) => {
  if (err.response) {
    return err.response.status >= 500 || [401, 408, 429].includes(err.response.status)
  }
  if (err.request) {
    return true
  }

  return [undefined, 1, 100, 124, 209].includes(err.code)
}

/**
 * @param {Object} entry waiting message
 * @returns {Promise<string>} 'retry' to stop here, 'next' to go on with the following message
 */
const attempt = async (entry) => {
  if (!currentAccount()) {
    return 'retry'
  }
  if (entry.account !== currentAccount() || !handlers[entry.type]) {
    return 'next' // belongs to another account (or unknown type): keep it, do not block the others
  }
  try {
    await handlers[entry.type](entry.data)
  } catch (err) {
    if (isRetryable(err)) {
      return 'retry'
    }
    console.error('message dropped:', entry.type, err)
  }
  const fresh = await get('outbox', entry.id)
  if (fresh && fresh.rev === entry.rev) {
    await remove('outbox', entry.id)
  }

  return 'next'
}

const sendFrom = async (entries) => {
  if (!entries.length || (await attempt(entries[0])) === 'retry') {
    return
  }
  await sendFrom(entries.slice(1))
}

/**
 * Send the waiting messages.
 * @returns {Promise} resolves when done; never rejects
 */
export const flush = () => {
  if (!flushing && navigator.onLine !== false) {
    flushing = getAll('outbox')
      .then(sendFrom)
      .catch((err) => console.warn('outbox:', err))
      .finally(() => { flushing = null })
  }

  return flushing || Promise.resolve()
}

/**
 * Store a message and try to send it.
 * @param {string} type message type (see registerHandler)
 * @param {Object} data JSON-compatible content
 * @param {string} [key] replaces the waiting message with the same key
 * @returns {Promise} resolves when stored; never rejects
 */
export const enqueue = async (type, data, key) => {
  try {
    const waiting = key ? (await getAll('outbox')).find((entry) => entry.key === key) : null
    await put('outbox', undefined, {
      ...(waiting || {}),
      type,
      data,
      key,
      account: currentAccount(),
      rev: waiting ? waiting.rev + 1 : 0
    })
  } catch (err) {
    console.error('message not stored:', err)

    return
  }
  flush()
}
