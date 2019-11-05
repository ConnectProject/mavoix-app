import Parse from 'parse'

import Tab, { HEX_COLOR_KEY } from '~/models/Tab'

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
export const watch = ({ commit, rootState, state }) => {
  new Parse.Query(Tab)
    .subscribe()
    .then((subscription) => {
      subscription.on('create', (tab) => {
        commit('addTab', tab)
      })

      subscription.on('update', (tab) => {
        commit('updateTab', tab)
        if (rootState.dropZone.tab.id === tab.id) {
          commit('dropZone/setTabColor', tab.get(HEX_COLOR_KEY), { root: true })
        }
      })

      subscription.on('delete', (tab) => {
        commit('deleteTab', tab)
      })
    })
}
