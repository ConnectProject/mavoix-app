let languagesObject

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
export const init = ({ commit }) => {
  try {
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
    speechSynthesis.cancel()
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
