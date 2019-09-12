import Parse from 'parse'

import DeviceInvitation, {
  TOKEN_KEY
} from 'mavoix-core/models/DeviceInvitation'

export const login = ({ commit, getters: { invitationCode } }) => {
  new Parse.Query(DeviceInvitation)
    .equalTo(TOKEN_KEY, invitationCode)
    .first()
    .catch(err => {
      throw err
    })
    .then(invitation => {
      if (!invitation) {
        return commit('setError', 'Wrong invitation code')
      }
      console.log(invitation)
      commit('login')
    })
}
