import Speak from 'speak-tts'

export const initTTS = ({ commit }) => {
  const speech = new Speak()
  speech.init({
    'volume': 1,
    'lang': 'fr-FR',
    'rate': 0.8,
    'pitch': 1
  }).catch((err) => {
    commit('setError', err)
  }).then(() => {
    commit('setTTS', speech)
  })
}
