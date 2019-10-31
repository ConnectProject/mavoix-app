import { Plugins } from '@capacitor/core'

const { TtsPlugin } = Plugins

export const init = ({ commit }) => {
  TtsPlugin.init()
    .then(() => {
      commit('ttsEnabled')
    })
    .catch((err) => {
      commit('setError', err)
    })
}

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
