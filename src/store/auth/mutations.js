/**
 * Used to set a new invitation code
 * @param {State} state
 * @param {String} invitationCode is the new invitation code
 */
export const setInvitationCode = (state, invitationCode) => {
  state.invitationCode = invitationCode
}

/**
 * Used to log in the user
 * @param {State} state
 */
export const login = (state) => {
  state.logged = true
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
