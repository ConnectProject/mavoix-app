import { modelToTabItem, itemIndex } from './utils'

/**
 * Set tab's color.
 * @param {State} state
 * @param {Number} hexColor new color
 */

export const setTabColor = (state, color) => {
  state.tab.color = color
}

export const setTabLanguage = (state, language) => {
  state.tab.language = language
}

export const setTabUser = (state, user) => {
  state.tab.user = user
}

export const setTabSpeed = (state, speed) => {
  state.tab.speed = speed
}

/**
 * Set tab's slug
 * @param {State} state
 * @param {*} slug new slug
 */
export const setTabSlug = (state, slug) => {
  state.tab.slug = slug
}

/**
 * Set tab's id
 * @param {State} state
 * @param {String} id new id
 */
export const setTabId = (state, id) => {
  state.tab.id = id
}

/**
 * Set tab items
 * @param {State} state
 * @param {[TabItemModel]} itemsModels array of tab's items model.
 */
export const setItems = (state, itemsModels) => {
  state.items = itemsModels.map((itemModel) => {
    return modelToTabItem(itemModel)
  })
}
/**
 * Add a tab item.
 * @param {State} state
 * @param {TabItemModel} itemModel tab's item model.
 */
export const addItem = (state, itemModel) => {
  state.items.push(modelToTabItem(itemModel))
}
/**
 * Update a tab item.
 * @param {State} state
 * @param {TabItemModel} itemModel tab's item model.
 */
export const updateItem = (state, itemModel) => {
  const item = modelToTabItem(itemModel)
  const index = itemIndex(item, state.items)

  state.items[index].name = item.name
  state.items[index].asset = item.asset
  state.items[index].available = item.available
  state.items[index].hidden = item.hidden
  state.items[index].order = item.order

  state.items.sort((a, b) => a.order < b.order ? -1 : (a.order > b.order ? 1 : 0))
}

/**
 * Delete a tab item.
 * @param {State} state
 * @param {TabItemModel} itemModel tab's item model.
 */
export const deleteItem = (state, itemModel) => {
  state.items.splice(itemIndex(modelToTabItem(itemModel), state.items), 1)
}

/**
 * Clear active items
 * @param {State} state
 */
export const clearActiveItems = (state) => {
  // seems useless
  // state.items.sort((a, b) => a.order < b.order ? -1 : (a.order > b.order ? 1 : 0))
  state.activeItems = []
}

/**
 * Update active items
 * @param {State} state
 * @param {item} item
 * @param {zone} zone
 * @param {position} position
 */
export const dropItem = (state, { item, position, zone }) => {
  state.activeItems = state.activeItems.filter((e) => { return typeof e.drop === 'undefined' })
  let i = itemIndex(item, state.activeItems)
  if (i !== -1) {
    state.activeItems.splice(i, 1)
  }
  if (zone === 'active') {
    item.active = true
    state.activeItems.splice(position, 0, item)
  }
}

// /**
//  * Add fake item at specified position, remove old fake item
//  * fake item is here to emulate a dropzone
//  * @param {State} state
//  * @param {position} position
//  */
// export const move = (state, position) => {
//   let item = { 'drop': true }
//   state.activeItems = state.activeItems.filter((e) => { return typeof e.drop === 'undefined' })
//   state.activeItems.splice(position, 0, item)
// }

/**
 * Set subscription
 * @param {State} state
 * @param {Subscription} subscription Parse Subscription
 */
export const setSubscription = (state, subscription) => {
  state.subscription = subscription
}

/**
 * Set an error
 * @param {State} state current state
 * @param {*} error an error to print
 */
export const setError = (state, error) => {
  console.error(error)
  state.error = error
}
