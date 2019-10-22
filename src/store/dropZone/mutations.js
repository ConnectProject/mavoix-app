import { modelToTabItem, itemIndex } from './utils'

export const setItems = (state, itemsModels) => {
  state.items = itemsModels.map((itemModel) => {
    return modelToTabItem(itemModel)
  })
}

export const setHexColor = (state, hexColor) => {
  state.hexColor = hexColor
}

export const setItemsRaw = (state, items) => {
  state.items = items
}

export const addItem = (state, itemModel) => {
  state.items.push(modelToTabItem(itemModel))
}

export const sortItems = (state) => {
  state.items.sort((a, b) => a.order < b.order ? -1 : (a.order > b.order ? 1 : 0))
}

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

export const deleteItem = (state, itemModel) => {
  state.items.splice(itemIndex(modelToTabItem(itemModel), state.items), 1)
}

export const clearActiveItems = (state) => {
  state.activeItems.forEach((item) => {
    state.items.push(item)
  })

  sortItems(state)

  state.activeItems = []
}

export const setActiveItems = (state, items) => {
  state.activeItems = items
}

export const setError = (state, error) => {
  console.error(error)
  state.error = error
}
