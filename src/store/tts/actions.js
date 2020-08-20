import { Plugins } from '@capacitor/core'

const { TtsPlugin } = Plugins

/**
 * Init capacitor's text to speech plugin
 * @param {Context} context
 */
export const init = ({ commit }) => {
  TtsPlugin.load({ locale: 'en_US', voice: 4 })
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
export const speak = ({ commit, rootState, getters: { playing, tts } }, text) => {
  if (tts) {
    commit('setPlaying', true)
    console.log(rootState.dropZone.tab.language)
    console.log(rootState.dropZone.tab.speed)
    TtsPlugin.speak({ text: text, locale: rootState.dropZone.tab.language, rate: '' + rootState.dropZone.tab.speed })
      .then(res => {
        let rate = 1
        if (rootState.dropZone.tab.speed) {
          rate = rootState.dropZone.tab.speed
        }
        let timer = text.length * 50 / rate
        setTimeout(() => {
          commit('setPlaying', false)
        }, timer)
      })
      .catch((err) => {
        commit('setError', err)
      })
  }
}
