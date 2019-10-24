import { modelToTabItem, itemIndex } from './utils'

/**
 * Set tab items
 * @param {State} state current state.
 * @param {[TabItemModel]} itemsModels array of tab's items model.
 */
export const setItems = (state, itemsModels) => {
  state.items = itemsModels.map((itemModel) => {
    return modelToTabItem(itemModel)
  })
}
/**
 * Add a tab item.
 * @param {State} state current state.
 * @param {TabItemModel} itemModel tab's item model.
 */
export const addItem = (state, itemModel) => {
  state.items.push(modelToTabItem(itemModel))
}
/**
 * Update a tab item.
 * @param {State} state current state.
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
 * @param {State} state current state.
 * @param {TabItemModel} itemModel tab's item model.
 */
export const deleteItem = (state, itemModel) => {
  state.items.splice(itemIndex(modelToTabItem(itemModel), state.items), 1)
}

/**
 * Sort tab items.
 * @param {State} state current state.
 */
export const sortItems = (state) => {
  state.items.sort((a, b) => a.order < b.order ? -1 : (a.order > b.order ? 1 : 0))
}

/**
 * Set tab's color.
 * @param {State} state current state.
 * @param {Number} hexColor tab's color
 */
export const setHexColor = (state, hexColor) => {
  state.hexColor = hexColor
}

/**
 * Set the dragged item.
 * @param {State} state current state.
 * @param {{}} dragged the dragged item.
 */
export const setDragged = (state, dragged) => {
  state.dragged = dragged
}

export const addActiveItem = (state, item) => {
  state.activeItems.push(item)
}

export const dropActiveItem = (state) => {
  state.activeItems.forEach(el => {
    el.dragged = false
  })
}

export const removeActiveItem = (state, item) => {
  state.activeItems.splice(itemIndex(item, state.activeItems), 1)
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
