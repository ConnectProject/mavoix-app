import Parse from 'parse'

import Tab from '~/models/Tab'

/**
 * Load available tabs and watch for changes.
 * @param {Context} ctx vuex action context.
 */
export const loadAndWatch = ({ commit, dispatch }) => {
  new Parse.Query(Tab)
    .find()
    .catch((err) => {
      commit('setError', err)
    })
    .then((tabs) => {
      commit('setTabs', tabs)
      dispatch('watch')
    })
}

/**
 * Watch for changes in tabs
 * @param {Context} ctx vuex action context.
 */
export const watch = ({ commit }) => {
  new Parse.Query(Tab)
    .subscribe()
    .then((subscription) => {
      subscription.on('create', (tab) => {
        commit('addTab', tab)
      })

      subscription.on('update', (tab) => {
        commit('updateTab', tab)
      })

      subscription.on('delete', (tab) => {
        commit('deleteTab', tab)
      })
    })
}
