import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import tabs from './tabs'
import dropZone from './dropZone'
import tts from './tts'
import stats from './stats'
import usage from './usage'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      tabs,
      dropZone,
      tts,
      stats,
      usage
    },

    strict: process.env.DEV
  })

  return Store
}
