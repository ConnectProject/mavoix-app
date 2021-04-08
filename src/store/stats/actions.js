/**
 * Here are the credentials to connect to connect
 */
const password = process.env.CONNECT_TOKEN
const username = process.env.CONNECT_APP_ID

/**
 * connect to connect...
 */

export const connectConnect = async function ({ commit }) {
  let response
  response = await this.$axios.get(`parse/login?password=${password}&username=${username}&=`, {
    headers: {
      'x-parse-application-id': 'connect',
      'x-parse-revocable-session': '1'
    }
  })
  console.log('sessionToken:')
  console.log(response.data.sessionToken)
  console.log(response)
  localStorage.sessionToken = response.data.sessionToken
}

export const startSession = async function ({ commit }) {
  let headers = {
    'content-type': 'application/json',
    'x-parse-application-id': 'connect',
    'x-parse-session-token': localStorage.sessionToken
  }
  let data = {
    'appId': 'mavoix-app',
    'sessionId': localStorage.sessionToken,
    'userId': localStorage.id,
    'sessionBegin': (new Date()).toISOString()
  }
  let response
  response = await this.$axios.post('parse/classes/sessionTimestamp', data, {
    headers: headers
  })
  console.log('resp:')
  console.log(response)
  localStorage.objectId = response.data.objectId
}

export const endSession = async function ({ commit }) {
  if (localStorage.objectId) {
    let headers = {
      'content-type': 'application/json',
      'x-parse-application-id': 'connect',
      'x-parse-session-token': localStorage.sessionToken
    }
    let data = {
      'sessionEnd': (new Date()).toISOString()
    }
    let response
    response = await this.$axios.put('parse/classes/sessionTimestamp/' + localStorage.objectId, data, {
      headers: headers
    })
    console.log('end session:')
    console.log(response)
  } else {
    console.log('sessionTimestamp objectId undefined, not sending anything to connect')
  }
}
