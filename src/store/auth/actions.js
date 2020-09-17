import { LocalStorage } from 'quasar'

import DeviceUser from '~/models/DeviceUser'
// import SessionModel from '~/models/Session'
// 70sfwc-maVoix
// d6b9fa2c-2c9a-4a05-8a4a-ffe54e373dbc
//
/**
 * Login with the invitation code (has the form username:password)
 * @param {Context} ctx
 */
export const loginCode = ({ commit, getters: { invitationCode } }) => {
  const [ username, password ] = invitationCode.split(':')
  console.log('login')
  DeviceUser.logIn(username, password)
    .catch((err) => {
      commit('setError', err)
    })
    .then((user) => {
      console.log(user)
      console.log(LocalStorage)
      LocalStorage.user = user
      LocalStorage.username = username
      LocalStorage.id = user.id
      console.log(LocalStorage.id)
      commit('login', user)
    })
}

export const login = ({ commit, getters: { username, password } }) => {
  DeviceUser.logIn(username, password)
    .catch((err) => {
      commit('setError', err)
    })
    .then((user) => {
      console.log(user)
      LocalStorage.user = user
      LocalStorage.username = username
      LocalStorage.id = user.id
      console.log(LocalStorage.id)
      commit('login', user)
    })
}
