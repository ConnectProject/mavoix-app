import { modelToTabItem, itemIndex } from './utils'

/**
 * Set tab's color.
 * @param {State} state current state.
 * @param {Number} hexColor tab's color
 */
export const setHexColor = (state, hexColor) => {
  state.hexColor = hexColor
}

export const setSlug = (state, slug) => {
  state.slug = slug
}

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

export const setActiveItems = (state, items) => {
  state.activeItems = []
}

export const clearActiveItems = (state) => {
  state.activeItems.forEach((activeItem) => {
    if (activeItem.tabSlug === state.slug) {
      state.items.push(activeItem)
    }
  })
  state.items.sort((a, b) => a.order < b.order ? -1 : (a.order > b.order ? 1 : 0))
  state.activeItems = []
}

/**
 * Set the dragged item.
 * @param {State} state current state.
 * @param {{}} dragged the dragged item.
 */
export const setDragged = (state, dragged) => {
  state.dragged = dragged
}

export const dropDragged = (state) => {
  if (state.draggedOver === 'passiv') {
    if (!state.items.some((item) => {
      return item.key === state.dragged.key
    })) {
      if (state.dragged.tabSlug === state.slug) {
        state.items.push(state.dragged)
        state.items.sort((a, b) => a.order < b.order ? -1 : (a.order > b.order ? 1 : 0))
      }
      state.activeItems.splice(itemIndex(state.dragged, state.activeItems), 1)
    }
  } else if (state.draggedOver === 'active') {
    if (!state.activeItems.some((activeItem) => {
      return activeItem.key === state.dragged.key
    })) {
      state.activeItems.push(state.dragged)
      state.items.splice(itemIndex(state.dragged, state.items), 1)
    }
  }
  state.dragged = null
  state.draggedOver = null
}

export const setDraggedOver = (state, over) => {
  state.draggedOver = over
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
