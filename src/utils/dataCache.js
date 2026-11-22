import Parse from 'parse'

import getCurrentUserId from '~/utils/getCurrentUserId'
import { get, put } from '~/utils/offlineDb'

/*
 * Copy of the Parse data (tabs, cards) kept in IndexedDB, so that the app starts and works without internet.
 * Online, every load refreshes the copy; offline (or when the server does not answer in time) the copy is used.
 */
const NETWORK_TIMEOUT_MS = 10000

const cacheKey = (name) => `${getCurrentUserId()}:${name}`

/**
 * @param {*} err an error
 * @returns {boolean} true when the error means that the server could not be reached
 */
export const isNetworkError = (err) => Boolean(err) && (
  err.code === Parse.Error.CONNECTION_FAILED || (err.request && !err.response)
)

/**
 * @param {string} name name of the cached list
 * @param {Parse.Object[]} objects objects to keep
 * @returns {Promise} resolves when stored; never rejects
 */
export const saveObjects = (name, objects) => (
  put('json', cacheKey(name), objects.map((object) => object._toFullJSON())).catch((err) => console.warn('cache not saved:', err))
)

/**
 * @param {string} name name of the cached list
 * @returns {Promise<(Parse.Object[]|null)>} the cached objects, null when there is no copy
 */
export const loadObjects = async (name) => {
  try {
    const json = await get('json', cacheKey(name))

    return json ? json.map((item) => Parse.Object.fromJSON(item)) : null
  } catch (err) {
    console.warn('cache not read:', err)

    return null
  }
}

const withTimeout = (promise, ms) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Object.assign(new Error('timeout'), { code: Parse.Error.CONNECTION_FAILED })), ms)
  promise.then(resolve, reject).finally(() => clearTimeout(timer))
})

/**
 * Run a server request; keep its result as the offline copy, or return the copy when the server cannot be reached.
 * @param {string} name name of the cached list
 * @param {function(): Promise<Parse.Object[]>} request the request (returns a list of objects)
 * @returns {Promise<Parse.Object[]>} fresh or cached objects
 */
export const requestCached = async (name, request) => {
  const cached = await loadObjects(name)
  if (cached && navigator.onLine === false) {
    return cached
  }
  try {
    const result = await (cached ? withTimeout(request(), NETWORK_TIMEOUT_MS) : request())
    saveObjects(name, result)

    return result
  } catch (err) {
    if (cached && isNetworkError(err)) {
      return cached
    }
    throw err
  }
}
