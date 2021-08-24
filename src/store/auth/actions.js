import DeviceUser from '~/models/DeviceUser'
// import SessionModel from '~/models/Session'
// 70sfwc-maVoix
// d6b9fa2c-2c9a-4a05-8a4a-ffe54e373dbc
//
/**
 * Login with the invitation code (has the form username:password)
 * @param {Context} ctx
 */
export async function loginCode ({ commit }, invitationCode) {
  const [username, password] = invitationCode.split(':')
  try {
    const user = await DeviceUser.logIn(username, password)
    console.log(user)
    // localStorage.id = user.id
    this.$router.push({ name: 'dropZone' })
  } catch (e) {
    commit('setError', e)
  }
}

// use normal function in order to bind this to this function
export async function login ({ commit }, [username, password]) {
  try {
    const user = await DeviceUser.logIn(username, password)
    console.log(user)
    // localStorage.id = user.id
    // console.log(localStorage.id)
    this.$router.push({ name: 'dropZone' })
  } catch (e) {
    commit('setError', e)
  }
}
