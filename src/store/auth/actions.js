import { LocalStorage } from 'quasar'

import DeviceUser from '~/models/DeviceUser'
// import SessionModel from '~/models/Session'

/**
 * Login with the invitation code (has the form username:password)
 * @param {Context} ctx
 */
export const login = ({ commit, getters: { invitationCode } }) => {
  console.log(invitationCode)
  const [ username, password ] = invitationCode.split(':')
  console.log('login')
  DeviceUser.logIn(username, password)
    .catch((err) => {
      commit('setError', err)
    })
    .then((user) => {
      // console.log('user:')
      // console.log(user)
      // let sessionId = user.attributes.sessionToken
      // let sessionUser = user.id
      // let sessionStart = user.createdAt
      // let sessionEnd = null
      // commit('sessionId', sessionId)
      // SessionModel.Create(sessionId, sessionUser, sessionStart, sessionEnd)
      console.log(LocalStorage)
      LocalStorage.user = user
      LocalStorage.id = user.id
      console.log(LocalStorage.id)
      commit('login', user)
    })
}

export const endSession = ({ commit }) => {
}
