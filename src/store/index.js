import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import tabs from './tabs'
import dropZone from './dropZone'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      tabs,
      dropZone
    },

    strict: process.env.DEV
  })

  return Store
}
