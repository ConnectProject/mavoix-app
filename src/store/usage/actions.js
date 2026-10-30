import Parse from 'parse'

import getCurrentUserId from '~/utils/getCurrentUserId'
import randomString from '~/utils/randomString'

/*
 * Usage recording for the panel's "Statistiques" page. Independent of the Connect sharing (store/stats).
 *   UsageSession { sessionId, user, device, begin, end }
 *   UsagePhrase  { sessionId, user, device, timestamp, cards: [{ assetId, word, imageURL, tabId, tabName }] }
 * `user` is the caregiver account and `device` the account that wrote the row; the API (cloud/setBeforeSave.js) sets
 * both and the owner-only ACL. A session ends after IDLE_MS without a phrase; its end is the last phrase of the session.
 * Rows that cannot be written (offline) are lost: recording must never get in the way of the child.
 */
const IDLE_MS = 20 * 60 * 1000

let session = null // Parse.Object of the current UsageSession
let opening = null // promise while a session is being created, so that quick phrases share it

/**
 * @param {Object} state module state
 * @param {Date} now current time
 * @returns {Promise<Parse.Object>} the current session, a new one when there is none or after a pause
 */
const ensureSession = (state, now) => {
  if (session && state.lastActivity && now - state.lastActivity <= IDLE_MS) {
    return opening || Promise.resolve(session)
  }
  const begin = state.activeSince && now - state.activeSince <= IDLE_MS ? state.activeSince : now
  session = new Parse.Object('UsageSession')
  session.set({ sessionId: randomString(12), user: getCurrentUserId(), begin, end: now })
  opening = session.save().finally(() => { opening = null })

  return opening
}

/**
 * @param {Object} rootState vuex root state
 * @param {Object[]} items cards of the sentence strip
 * @returns {Object[]} the cards as stored in a UsagePhrase
 */
const toCards = (rootState, items) => items.map((item) => {
  const tab = rootState.tabs.tabs.find((t) => t.slug === item.tabSlug) || {}

  return { assetId: item.asset.id, word: item.name, imageURL: item.asset.url, tabId: tab.id || null, tabName: tab.name || null }
})

/**
 * Call when the app opens or becomes visible again.
 * @param {Context} ctx vuex action context
 * @returns {void}
 */
export const touch = ({ commit }) => {
  commit('setActiveSince', new Date())
}

/**
 * Record the sentence of the strip as a phrase (call when the child plays it).
 * @param {Context} ctx vuex action context
 * @returns {Promise} resolves when written; never rejects
 */
export const recordPhrase = async ({ state, commit, rootState, rootGetters }) => {
  const items = rootGetters['dropZone/activeItems']
  if (!items.length || !Parse.User.current()) {
    return
  }
  const now = new Date()
  try {
    const current = await ensureSession(state, now)
    commit('setLastActivity', now)
    const phrase = new Parse.Object('UsagePhrase')
    phrase.set({ sessionId: current.get('sessionId'), user: getCurrentUserId(), timestamp: now, cards: toCards(rootState, items) })
    await phrase.save()
    current.set('end', now)
    await current.save()
  } catch (err) {
    console.error('usage not recorded:', err)
  }
}
