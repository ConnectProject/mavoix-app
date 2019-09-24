import { LocalStorage } from 'quasar'

import DeviceUser from '~/models/DeviceUser'

export const login = ({ commit, getters: { invitationCode } }) => {
  const [ username, password ] = invitationCode.split(':')

  DeviceUser.logIn(username, password)
    .catch((err) => {
      commit('setError', err)
    })
    .then((user) => {
      LocalStorage.set('user', user)
      commit('login')
    })
}
