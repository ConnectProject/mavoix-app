/**
 * Used to throw an error
 * @param {State} state
 * @param {Error} error is the error to set
 */
export const setError = (state, error) => {
  console.error(error)
  state.error = error.message
}

/**
 * Used to reset a thrown error so that it can be thrown again
 * @param {State} state
 */
export const resetError = (state) => {
  state.error = null
}

export const sessionId = (state, value) => {
  state.sessionId = value
}
