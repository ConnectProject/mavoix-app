import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import tabs from './tabs'
import dropZone from './dropZone'
import tts from './tts'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      tabs,
      dropZone,
      tts
    },

    strict: process.env.DEV
  })

  return Store
}
