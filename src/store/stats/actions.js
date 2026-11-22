import Parse from 'parse'

import { enqueue } from '~/utils/outbox'
import randomString from '~/utils/randomString'

/*
 * Optional data sharing with Connect. The posts go through the outbox (utils/outbox.js, sent by store/stats/outbox.js):
 * without internet they wait on the device. Whether the account is linked to Connect is remembered in localStorage,
 * because it cannot be asked to the server offline.
 */
const LINKED_KEY = 'mavoix.connectLinked'

const rememberLinked = (linked) => {
  try {
    localStorage.setItem(LINKED_KEY, linked ? Parse.User.current().id : '')
  } catch (e) {
    // storage not available: the link is checked again at the next start
  }
}

const isLinked = (state) => {
  try {
    return Boolean(state.accessToken) || (Boolean(Parse.User.current()) && localStorage.getItem(LINKED_KEY) === Parse.User.current().id)
  } catch (e) {
    return Boolean(state.accessToken)
  }
}

const post = (path, body) => enqueue('connect-post', { path: 'parse/classes/' + path, body })

/**
 * Get the Connect access token.
 * @returns {Promise<string>} 'linked', 'unlinked' (the server answered: no link) or 'error' (not reachable)
 */
export const connectConnect = async function ({ commit }) {
  try {
    const { accessToken } = await Parse.Cloud.run('getConnectToken')
    commit('setAccessToken', accessToken)
    rememberLinked(Boolean(accessToken))

    return accessToken ? 'linked' : 'unlinked'
  } catch (e) {
    console.error(e)

    return 'error'
  }
}

export const startSession = async function ({ state, commit }) {
  if (!isLinked(state)) {
    console.log('not connected to connect')
    return
  }
  const connectSessionId = randomString(8)
  commit('setConnectSessionId', connectSessionId)
  await post('sessionTimestamp', { sessionId: connectSessionId, sessionBegin: (new Date()).toISOString() })
}

export const endSession = async function ({ state }) {
  const { connectSessionId } = state
  if (!connectSessionId) {
    console.log('connectSessionId undefined, not sending anything to connect')
    return
  }
  await post('sessionTimestamp', { sessionId: connectSessionId, sessionEnd: (new Date()).toISOString() })
}

export const saveSentence = async function ({ state, rootGetters }) {
  const { connectSessionId } = state
  if (!connectSessionId) {
    console.log('connectSessionId undefined, not sending anything to connect')
    return
  }
  const phrase = rootGetters['dropZone/activeItems'].map(item => ({ imageURL: item.asset.url, wordPronounced: item.name }))
  await post('phraseProduced', { sessionId: connectSessionId, timestamp: (new Date()).toISOString(), phrase })
}
