/**
 * Used to set a new invitation code
 * @param {State} state
 * @param {String} invitationCode is the new invitation code
 */
export const setInvitationCode = (state, invitationCode) => {
  console.log('setInvitationCode: ' + invitationCode)
  state.invitationCode = invitationCode
}

/**
 * Used to log in the user
 * @param {State} state
 */
export const login = (state, user) => {
  state.logged = true
}

export const logout = (state, user) => {
  state.logged = false
}

/**
 * Used to throw an error
 * @param {State} state
 * @param {Error} error is the error to set
 */
export const setError = (state, error) => {
  console.error(error)
  state.error = error
}

export const sessionId = (state, value) => {
  state.sessionId = value
}
