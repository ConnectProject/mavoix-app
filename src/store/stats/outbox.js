import { axiosInstance } from '~/boot/axios'

/**
 * Headers of every request to Connect. With CONNECT_SANDBOX=true the data goes to Connect's test environment.
 * @param {string} accessToken Connect access token
 * @returns {Object} headers
 */
export const connectHeaders = (accessToken) => ({
  'content-type': 'application/json',
  'x-parse-application-id': 'connect',
  Authorization: 'Bearer ' + accessToken,
  ...(process.env.CONNECT_SANDBOX === 'true' && { 'x-is-sandbox': 'true' })
})

const post = ({ state }, { path, body }) => (
  axiosInstance.post(path, body, { headers: connectHeaders(state.accessToken) })
)

/**
 * Send a queued post to Connect (see utils/outbox.js). Gets the access token first when there is none, and
 * asks for a new one when Connect refuses it.
 * @param {Store} store vuex store
 * @param {{path: string, body: Object}} data the request
 * @returns {Promise} resolves when sent
 */
export const sendConnect = async (store, data) => {
  if (!store.state.stats.accessToken) {
    const status = await store.dispatch('stats/connectConnect')
    if (status === 'unlinked') {
      return // sharing was turned off in the panel: nothing to send, the message is dropped
    }
    if (status === 'error') {
      throw Object.assign(new Error('no Connect token'), { request: {} }) // retried later
    }
  }
  try {
    return await post({ state: store.state.stats }, data)
  } catch (err) {
    if (!err.response || err.response.status !== 401) {
      throw err
    }
    await store.dispatch('stats/connectConnect')

    return post({ state: store.state.stats }, data)
  }
}
