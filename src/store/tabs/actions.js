import Parse from 'parse'

import Tab, { HEX_COLOR_KEY, SPEED_KEY, LANGUAGE_KEY } from '~/models/Tab'
import getCurrentUserId from '~/utils/getCurrentUserId'

/**
 * Load available tabs and watch for changes.
 * @param {Context} ctx vuex action context.
 */
export const loadAndWatch = ({ commit, dispatch }) => {
  return new Parse.Query(Tab)
    .equalTo('user', getCurrentUserId())
    .find()
    .then((tabs) => {
      commit('setTabs', tabs)
      dispatch('watch')
    })
  // .catch((err) => {
  //   alert('loadAndWatch: ' + err)
  //   commit('setError', err)
  // })
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
          commit('dropZone/setTabSpeed', tab.get(SPEED_KEY), { root: true })
          commit('dropZone/setTabLanguage', tab.get(LANGUAGE_KEY), { root: true })
        }
      })

      subscription.on('delete', (tab) => {
        commit('deleteTab', tab)
      })
    })
}
