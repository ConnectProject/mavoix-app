import { Plugins } from '@capacitor/core'

const { TtsPlugin } = Plugins

/**
 * Init capacitor's text to speech plugin
 * @param {Context} context
 */
export const init = ({ commit }) => {
  TtsPlugin.load()
    .then(() => {
      commit('ttsEnabled')
    })
    .catch((err) => {
      commit('setError', err)
    })
}

/**
 * Speek a text using the capacitor plugin
 * @param {Context} context
 * @param {String} text the phrase to speek
 */
export const speak = ({ commit, getters: { tts } }, text) => {
  if (tts) {
    TtsPlugin.speak({ text })
      .then(() => {

      })
      .catch((err) => {
        commit('setError', err)
      })
  }
}
