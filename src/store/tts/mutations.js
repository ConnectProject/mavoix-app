export const ttsEnabled = (state) => {
  state.tts = true
}

export const setError = (state, err) => {
  state.ttsEnabled = false
  console.error(err)
}
