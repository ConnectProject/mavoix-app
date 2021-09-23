import Parse from 'parse'
import randomString from '~/utils/randomString'

/**
 * connect to connect...
 */
export const connectConnect = async function ({ commit }) {
  try {
    const { accessToken } = await Parse.Cloud.run('getConnectToken')
    commit('setAccessToken', accessToken)
  } catch (e) {
    console.error(e)
  }
}

export const startSession = async function ({ state, commit }) {
  const { accessToken } = state
  if (!accessToken) {
    console.log('not connected to connect')
    return
  }
  const connectSessionId = randomString(8)
  let headers = {
    'content-type': 'application/json',
    'x-parse-application-id': 'connect',
    Authorization: 'Bearer ' + state.accessToken
  }
  let data = {
    'sessionId': connectSessionId,
    'sessionBegin': (new Date()).toISOString()
  }
  try {
    let response = await this.$axios.post('parse/classes/sessionTimestamp', data, {
      headers: headers
    })
    commit('setConnectSessionId', connectSessionId)
    console.log('start session:')
    console.log(response)
  } catch (e) {
    console.error('error when sending data to connect')
    console.log(e.response.data)
  }
}

export const endSession = async function ({ state }) {
  const { accessToken, connectSessionId } = state
  if (!connectSessionId) {
    console.log('connectSessionId undefined, not sending anything to connect')
    return
  }
  let headers = {
    'content-type': 'application/json',
    'x-parse-application-id': 'connect',
    Authorization: 'Bearer ' + accessToken
  }
  let data = {
    'sessionId': connectSessionId,
    'sessionEnd': (new Date()).toISOString()
  }
  try {
    let response = await this.$axios.post('parse/classes/sessionTimestamp', data, {
      headers: headers
    })
    console.log('end session:')
    console.log(response)
  } catch (e) {
    console.error('error when sending data to connect')
    console.log(e.response.data)
  }
}

export const saveSentence = async function ({ state, rootGetters }) {
  const { accessToken, connectSessionId } = state
  if (!connectSessionId) {
    console.log('connectSessionId undefined, not sending anything to connect')
    return
  }
  const activeImages = rootGetters['dropZone/activeItems'].map(item => {
    const container = {}
    container['imageURL'] = item.asset.url
    container['wordPronounced'] = item.name
    return container
  })
  let headers = {
    'content-type': 'application/json',
    'x-parse-application-id': 'connect',
    Authorization: 'Bearer ' + accessToken
  }
  let data = {
    'sessionId': connectSessionId,
    'timestamp': (new Date()).toISOString(),
    'phrase': activeImages
  }
  try {
    let response = await this.$axios.post('parse/classes/phraseProduced', data, {
      headers: headers
    })
    console.log('sentence saved:')
    console.log(response)
  } catch (e) {
    console.error('error when sending data to connect')
    console.log(e.response.data)
  }
}
