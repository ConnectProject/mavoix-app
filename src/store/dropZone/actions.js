import Parse from 'parse'

import TabItemModel, { TAB_KEY, ORDER_KEY, ASSET_KEY } from '~/models/TabItem'
import { slugToTabModel } from './utils'
import { HEX_COLOR_KEY, SPEED_KEY, LANGUAGE_KEY } from '~/models/Tab'

/**
 * Return a parse query to find all TabItem from their TabModel parent
 * @param {TabModel} tabModel the items's parent
 */
const itemsQuery = (tabModel) => (
  new Parse.Query(TabItemModel).equalTo(TAB_KEY, tabModel).include(ASSET_KEY).ascending(ORDER_KEY)
)

/**
 * Initialize the dropzone by doing theses steps:
 *  - Check the slug validity
 *  - Load every items for the loaded tab
 *  - Start the websocket subscription
 * @param {Context} ctx
 * @param {String} slug is the tab's slug
 */
export const init = ({ commit, dispatch, state }, slug) => {
  // If the another item's subscription is already runned: unsubscribe
  if (state.subscription) {
    state.subscription.unsubscribe()
  }
  slugToTabModel(slug)
    .then((tabModel) =>
      itemsQuery(tabModel)
        .find()
        .then((itemsModel) => {
          // Set tab's data
          commit('setTabSlug', slug)
          commit('setTabId', tabModel.id)
          commit('setTabUser', tabModel.get('user'))
          commit('setTabColor', tabModel.get(HEX_COLOR_KEY))
          commit('setTabSpeed', tabModel.get(SPEED_KEY))
          commit('setTabLanguage', tabModel.get(LANGUAGE_KEY))
          commit('setItems', itemsModel)

          // Launch subscriptions
          return dispatch('watch', slug)
        })
    )
    .catch((err) => {
      commit('setError', err)
    })
}

/**
 * Run Subscription for the tab by doing these steps:
 *  - Check the slug validity
 *  - Subscribe for any changes on tab's item
 * @param {Context} ctx
 * @param {String} slug is the tab's slug
 */
export const watch = ({ commit }, slug) => {
  slugToTabModel(slug)
    .then((tabModel) => {
      itemsQuery(tabModel)
        .subscribe()
        .then((subscription) => {
          subscription.on('create', async (itemModel) => {
            try {
              await itemModel.get('asset').fetch()
            } catch (error) {
              // Handle the case where the 'asset' object has been deleted
              console.warn('Error fetching asset:', error)
            }
            commit('addItem', itemModel)
          })

          subscription.on('update', (itemModel) => {
            commit('updateItem', itemModel)
          })

          subscription.on('delete', (itemModel) => {
            commit('deleteItem', itemModel)
          })
          commit('setSubscription', subscription)
        })
    })
    .catch((err) => {
      commit('setError', err)
    })
}
