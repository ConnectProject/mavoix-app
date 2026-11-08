import { Capacitor, Plugins } from '@capacitor/core'

let languagesObject

// Android's WebView has no window.speechSynthesis: use the native TtsPlugin there.
const isAndroidNative = () => Capacitor.isNative && Capacitor.platform === 'android'

// The engine can be slow or not ready right after the app starts: load() resolves when it is.
const loadNative = ({ commit }) => Plugins.TtsPlugin.load().then(() => commit('ttsEnabled'))

const speakNative = ({ commit }, phrase, tab) => {
  commit('setPlaying', true)
  Plugins.TtsPlugin.speak({
    text: phrase,
    locale: tab.language || 'fr_FR',
    rate: String(parseFloat(tab.speed) || 1)
  })
    .catch((err) => commit('setError', err))
    .then(() => commit('setPlaying', false))
}

function loadVoices ({ commit }) {
  try {
    languagesObject = {}
    console.log('will get voices')
    const voices = speechSynthesis.getVoices()
    console.log(`${voices.length} voices loaded`)

    // Organize voices by language
    voices.forEach((voice) => {
      const lang = voice.lang.replace('_', '-')
      if (!languagesObject[lang]) {
        languagesObject[lang] = []
      }
      languagesObject[lang].push(voice)
    })

    if ('en-US' in languagesObject) {
      commit('ttsEnabled')
    }
  } catch (err) {
    commit('setError', err)
  }
}

/**
 * Init capacitor's text to speech plugin
 * @param {Context} context
 */
export const init = ({ commit, rootState }) => {
  try {
    if (isAndroidNative()) {
      // one retry: the first attempt can fail while the speech engine is still starting
      loadNative({ commit })
        .catch(() => new Promise((resolve) => setTimeout(resolve, 3000)).then(() => loadNative({ commit })))
        // wake the engine up with a silent utterance so the first real sentence is not slow
        .then(() => Plugins.TtsPlugin.warmup({ locale: rootState.dropZone.tab.language || 'fr_FR' }))
        .catch((err) => commit('setError', err))
      return
    }
    // Execute loadVoices.
    loadVoices({ commit })

    // Chrome loads voices asynchronously.
    speechSynthesis.onvoiceschanged = function (e) {
      loadVoices({ commit })
    }
  } catch (err) {
    commit('setError', err)
  }
}

/**
 * Stop any in-progress speech and clear the playing flag.
 * @param {Context} context
 */
export const cancel = ({ commit }) => {
  try {
    if (isAndroidNative()) {
      Plugins.TtsPlugin.stop()
    } else {
      speechSynthesis.cancel()
    }
  } catch (e) {
    // ignore (e.g. non-browser / no API)
  }
  commit('setPlaying', false)
}

/**
 * Speek a text using the capacitor plugin
 * @param {Context} context
 * @param {String} text the phrase to speek
 */
export const speak = ({ commit, rootState, getters: { tts } }, text) => {
  try {
    const phrase = String(text || '').trim()
    if (!phrase) {
      return
    }
    if (isAndroidNative()) {
      // not ready yet (slow start, failed init): load the engine now, then speak
      const ready = tts ? Promise.resolve() : loadNative({ commit })
      ready
        .then(() => speakNative({ commit }, phrase, rootState.dropZone.tab))
        .catch((err) => commit('setError', err))
      return
    }
    if (!tts) {
      console.log('trying to load voices')
      loadVoices({ commit })
    }
    if (tts) {
      commit('setPlaying', true)

      const utterance = new SpeechSynthesisUtterance(phrase)
      utterance.rate = parseFloat(rootState.dropZone.tab.speed) || 1
      const locale = rootState.dropZone.tab.language.replace('_', '-')
      utterance.voice = languagesObject[locale][0]
      console.log(utterance)

      utterance.onend = function () {
        commit('setPlaying', false)
      }
      speechSynthesis.speak(utterance)
    }
  } catch (err) {
    commit('setError', err)
  }
}
