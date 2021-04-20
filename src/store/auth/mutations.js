/**
 * Used to set a new invitation code
 * @param {State} state
 * @param {String} invitationCode is the new invitation code
 */
export const setInvitationCode = (state, invitationCode) => {
  state.invitationCode = invitationCode
}

export const setUsername = (state, username) => {
  state.username = username.toLowerCase()
}

export const setPassword = (state, password) => {
  state.password = password
}

/**
 * Used to throw an error
 * @param {State} state
 * @param {Error} error is the error to set
 */
export const setError = (state, error) => {
  console.error(error)
  state.error = error.message
}

export const sessionId = (state, value) => {
  state.sessionId = value
}
