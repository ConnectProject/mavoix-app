import Parse from 'parse'

import TabItemModel, { TAB_KEY, ORDER_KEY, ASSET_KEY } from '~/models/TabItem'
import { slugToTabModel } from './utils'
import { requestCached } from '~/utils/dataCache'
import { HEX_COLOR_KEY, SPEED_KEY, LANGUAGE_KEY, IMAGE_SIZE_KEY } from '~/models/Tab'

/**
 * Return a parse query to find all TabItem from their TabModel parent
 * @param {TabModel} tabModel the items's parent
 */
const itemsQuery = (tabModel) => (
  new Parse.Query(TabItemModel).equalTo(TAB_KEY, tabModel).include(ASSET_KEY).ascending(ORDER_KEY)
)

/**
 * Load the tab's settings and items (from the offline copy when the server cannot be reached).
 * @param {Context} ctx
 * @param {String} slug is the tab's slug
 * @returns {Promise<boolean>} false when there is no such tab
 */
const loadTab = async ({ commit }, slug) => {
  const tabModel = await slugToTabModel(slug)
  if (!tabModel) {
    return false
  }
  const itemsModel = await requestCached(`items:${tabModel.id}`, () => itemsQuery(tabModel).find())
  // cards read from the offline copy only hold a pointer to their tab: give them the tab itself (for its slug)
  itemsModel.forEach((item) => item.set(TAB_KEY, tabModel))
  commit('setTabSlug', slug)
  commit('setTabId', tabModel.id)
  commit('setTabUser', tabModel.get('user'))
  commit('setTabColor', tabModel.get(HEX_COLOR_KEY))
  commit('setTabSpeed', tabModel.get(SPEED_KEY))
  commit('setTabLanguage', tabModel.get(LANGUAGE_KEY))
  commit('setTabImageSize', tabModel.get(IMAGE_SIZE_KEY))
  commit('setItems', itemsModel)

  return true
}

/**
 * Initialize the dropzone by doing theses steps:
 *  - Check the slug validity
 *  - Load every items for the loaded tab
 *  - Start the websocket subscription
 * @param {Context} ctx
 * @param {String} slug is the tab's slug
 */
export const init = (ctx, slug) => {
  const { commit, dispatch, state } = ctx
  // If the another item's subscription is already runned: unsubscribe
  if (state.subscription) {
    state.subscription.unsubscribe()
  }

  return loadTab(ctx, slug)
    .then((found) => found && dispatch('watch', slug))
    .catch((err) => {
      commit('setError', err)
    })
}

/**
 * Reload the open tab, e.g. when the connection is back: changes made meanwhile are not sent by the live query.
 * @param {Context} ctx
 */
export const refresh = (ctx) => {
  const { state, commit } = ctx
  if (!state.tab.slug) {
    return Promise.resolve()
  }

  return loadTab(ctx, state.tab.slug).catch((err) => commit('setError', err))
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

const SCALE_STORAGE_KEY = 'mavoix.deviceImageScale'

/**
 * Follow the image size chosen for this device in the panel (it overrides the tab's image size).
 * The last value is kept in localStorage so that it also applies offline.
 * @param {Context} ctx
 */
export const watchDeviceSettings = async ({ commit }) => {
  const stored = localStorage.getItem(SCALE_STORAGE_KEY)
  commit('setDeviceImageScale', stored === null ? null : Number(stored))
  const apply = (row) => {
    const scale = row ? row.get('imageScale') : null
    const value = typeof scale === 'number' ? scale : null
    value === null ? localStorage.removeItem(SCALE_STORAGE_KEY) : localStorage.setItem(SCALE_STORAGE_KEY, String(value))
    commit('setDeviceImageScale', value)
  }
  try {
    const query = new Parse.Query('DeviceSettings').equalTo('device', Parse.User.current().id)
    apply(await query.first())
    const subscription = await query.subscribe()
    subscription.on('create', apply)
    subscription.on('update', apply)
    subscription.on('enter', apply)
    subscription.on('delete', () => apply(null))
  } catch (err) {
    console.warn('device settings not loaded:', err)
  }
}
