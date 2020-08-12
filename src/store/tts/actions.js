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
export const speak = ({ commit, getters: { playing, tts } }, text) => {
  if (tts) {
    commit('setPlaying', true)
    TtsPlugin.speak({ text })
      .then(res => {
        let timer = text.length * 50
        setTimeout(() => {
          commit('setPlaying', false)
        }, timer)
      })
      .catch((err) => {
        commit('setError', err)
      })
  }
}
