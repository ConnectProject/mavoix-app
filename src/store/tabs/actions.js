import Parse from 'parse'

import Tab, { HEX_COLOR_KEY, SPEED_KEY, LANGUAGE_KEY, IMAGE_SIZE_KEY } from '~/models/Tab'
import getCurrentUserId from '~/utils/getCurrentUserId'
import { requestCached } from '~/utils/dataCache'
import { syncOfflineData } from '~/utils/offlineSync'

const tabsQuery = () => new Parse.Query(Tab).equalTo('user', getCurrentUserId())

/**
 * Load available tabs and watch for changes.
 * @param {Context} ctx vuex action context.
 */
export const loadAndWatch = ({ commit, dispatch }) => {
  return dispatch('load').then(() => dispatch('watch'))
}

/**
 * Load the tabs (from the offline copy when the server cannot be reached) and refresh the offline copy of every card.
 * @param {Context} ctx vuex action context.
 */
export const load = async ({ commit }) => {
  const tabs = await requestCached('tabs', () => tabsQuery().find())
  commit('setTabs', tabs)
  syncOfflineData(tabs)
}

/**
 * Reload the tabs, e.g. when the connection is back: changes made meanwhile are not sent by the live query.
 * @param {Context} ctx vuex action context.
 */
export const refresh = ({ dispatch }) => dispatch('load').catch((err) => console.warn('tabs not refreshed:', err))

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
          commit('dropZone/setTabImageSize', tab.get(IMAGE_SIZE_KEY), { root: true })
        }
      })

      subscription.on('delete', (tab) => {
        commit('deleteTab', tab)
      })
    })
}
