/**
 * Call when tts plugin loaded
 * @param {State} state
 */
export const ttsEnabled = (state) => {
  state.tts = true
}

/**
 * Set an error
 * @param {State} state current state
 * @param {*} error an error to print
 */
export const setError = (state, err) => {
  state.tts = false
  console.error(err)
}
