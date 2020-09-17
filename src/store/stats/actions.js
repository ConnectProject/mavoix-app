import { LocalStorage } from 'quasar'

/**
 * Here are the credentials to connect to connect
 */
const password = '16121a27-2b93-4e93-b69e-d7958e9f3cf0'
const username = '70sfwc-maVoix'

/**
 * connect to connect...
 */

export const connectConnect = ({ commit }) => {
  this.$axios.get('parse/login?password=' + password + '&username=' + username + 'x&=', {
    headers: {
      'x-parse-application-id': 'connect',
      'x-parse-revocable-session': '1'
    }
  }).then(function (response) {
    LocalStorage.session = response.data.sessionToken
  })
}

export const startSession = ({ commit }) => {
  let headers = {
    'content-type': 'application/json',
    'x-parse-application-id': 'connect',
    'x-parse-session-token': LocalStorage.session
  }
  let data = {
    'schemaURL': 'http://connect-project.io/schemas/sessionTimestamp.schema.json',
    'data': {
      'appId': 'mavoix-app',
      'sessionId': LocalStorage.session,
      'userId': LocalStorage.id,
      'sessionBegin': Date.now()
    }
  }
  this.$axios.post('parse/classes/jsonSchemaData', data, {
    headers: headers
  }).then(function (response) {
    console.log('resp:')
    console.log(response)
  })
}