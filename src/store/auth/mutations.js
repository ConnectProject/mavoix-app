export const setInvitationCode = (state, invitationCode) => {
  state.invitationCode = invitationCode
}

export const login = (state) => {
  state.logged = true
}

export const setError = (state, error) => {
  state.error = error
}
