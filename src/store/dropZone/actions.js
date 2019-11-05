import Parse from 'parse'

import TabItem, { TAB_KEY, ORDER_KEY } from '~/models/TabItem'
import { slugToTabModel } from './utils'
import { HEX_COLOR_KEY } from '~/models/Tab'

const _itemsQuery = (tabModel) => new Parse.Query(TabItem).equalTo(TAB_KEY, tabModel).ascending(ORDER_KEY)

export const init = ({ commit, dispatch, state }, slug) => {
  if (state.subscription) {
    state.subscription.unsubscribe()
  }
  slugToTabModel(slug)
    .catch((err) => {
      commit('setError', err)
    })
    .then((tabModel) => {
      _itemsQuery(tabModel)
        .find()
        .catch((err) => {
          commit('setError', err)
        })
        .then((itemsModel) => {
          commit('setTabSlug', slug)
          commit('setTabId', tabModel.id)
          commit('setTabColor', tabModel.get(HEX_COLOR_KEY))
          commit('setItems', itemsModel)
          dispatch('watch', slug)
        })
    })
}

export const watch = ({ commit }, slug) => {
  slugToTabModel(slug)
    .catch((err) => {
      commit('setError', err)
    })
    .then((tabModel) => {
      _itemsQuery(tabModel)
        .subscribe()
        .then((subscription) => {
          subscription.on('create', (tabModel) => {
            commit('addItem', tabModel)
          })

          subscription.on('update', (tabModel) => {
            commit('updateItem', tabModel)
          })

          subscription.on('delete', (tabModel) => {
            commit('deleteItem', tabModel)
          })
          commit('setSubscription', subscription)
        })
    })
}
