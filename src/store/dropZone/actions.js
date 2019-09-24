import Parse from 'parse'

import TabItem, { TAB_KEY } from '~/models/TabItem'
import { slugToTabModel } from './utils'

const _itemsQuery = (tabModel) => new Parse.Query(TabItem).equalTo(TAB_KEY, tabModel)

export const init = ({ commit, dispatch }, slug) => {
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
        })
    })
}
