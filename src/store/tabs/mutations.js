import { modelToTab, tabIndex } from './utils'

export const setTabs = (state, tabsModel) => {
  state.tabs = tabsModel.map((tabModel) => {
    return modelToTab(tabModel)
  })
}

export const addTab = (state, tabModel) => {
  state.tabs.push(modelToTab(tabModel))
}

export const updateTab = (state, tabModel) => {
  const tab = modelToTab(tabModel)
  const i = tabIndex(tab, state.tabs)

  state.tabs[i].name = tab.name
  state.tabs[i].hexColor = tab.hexColor
  state.tabs[i].slug = tab.slug
}

export const deleteTab = (state, tabModel) => {
  state.tabs.splice(tabIndex(modelToTab(tabModel), state.tabs), 1)
}

export const setError = (state, error) => {
  console.error(error)
  state.error = error
}
