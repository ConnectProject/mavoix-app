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
  try {
    DeviceUser.logIn(username, password)
      .then((user) => {
        console.log(user)
        localStorage.id = user.id
        console.log(localStorage.id)
        commit('login', user)
      })
      .catch((err) => {
        commit('setError', err)
      })
  } catch (e) {
    commit('setError', new Error('Unable to initiate Parse: ' + e))
  }
}

export const login = ({ commit, getters: { username, password } }) => {
  try {
    DeviceUser.logIn(username, password)
      .then((user) => {
        console.log(user)
        localStorage.id = user.id
        console.log(localStorage.id)
        commit('login', user)
      })
      .catch((err) => {
        commit('setError', err)
      })
  } catch (e) {
    commit('setError', new Error('Unable to initiate Parse: ' + e))
  }
}
