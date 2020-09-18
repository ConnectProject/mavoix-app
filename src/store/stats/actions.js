import { LocalStorage } from 'quasar'

/**
 * Here are the credentials to connect to connect
 */
const password = '8a761417-4fc9-4de1-8462-8936283ef857'
const username = 'hkt4j7-test'

/**
 * connect to connect...
 */

export const connectConnect = async function ({ commit }) {
  let response
  response = await this.$axios.get('parse/login?password=' + password + '&username=' + username + '&=', {
    headers: {
      'x-parse-application-id': 'connect',
      'x-parse-revocable-session': '1'
    }
  })
  console.log('sessionToken:')
  console.log(response.data.sessionToken)
  console.log(response)
  LocalStorage.sessionToken = response.data.sessionToken
}

export const startSession = async function ({ commit }) {
  let headers = {
    'content-type': 'application/json',
    'x-parse-application-id': 'connect',
    'x-parse-session-token': LocalStorage.sessionToken
  }
  let data = {
    'schemaURL': 'http://connect-project.io/schemas/sessionTimestamp.schema.json',
    'data': {
      'appId': 'mavoix-app',
      'sessionId': LocalStorage.sessionToken,
      'userId': LocalStorage.id,
      'sessionBegin': Date.now()
    }
  }
  let response
  response = await this.$axios.post('parse/classes/jsonSchemaData', data, {
    headers: headers
  })
  LocalStorage.objectId = response.objectId
  console.log('resp:')
  console.log(response)
}

export const endSession = async function ({ commit }) {
  let headers = {
    'content-type': 'application/json',
    'x-parse-application-id': 'connect',
    'x-parse-session-token': LocalStorage.sessionToken
  }
  let data = {
    'schemaURL': 'http://connect-project.io/schemas/sessionTimestamp.schema.json',
    'data': {
      'sessionEnd': Date.now()
    }
  }
  let response
  response = await this.$axios.put('parse/classes/jsonSchemaData/' + LocalStorage.objectId, data, {
    headers: headers
  })
  console.log('end session:')
  console.log(response)
}
