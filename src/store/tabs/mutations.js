import { modelToTab, tabIndex } from './utils'

/**
 * Set tabs.
 * @param {State} state current state.
 * @param {[TabModel]} tabsModel array of tabs models.
 */
export const setTabs = (state, tabsModel) => {
  state.tabs = tabsModel.map((tabModel) => {
    return modelToTab(tabModel)
  })
}

/**
 * Add a tab.
 * @param {State} state current state.
 * @param {TabModel} tabModel a tab model.
 */
export const addTab = (state, tabModel) => {
  state.tabs.push(modelToTab(tabModel))
}

/**
 * Update a tab.
 * @param {State} state current state.
 * @param {TabModel} tabModel a tab model.
 */
export const updateTab = (state, tabModel) => {
  const tab = modelToTab(tabModel)
  const i = tabIndex(tab, state.tabs)

  state.tabs[i].name = tab.name
  state.tabs[i].hexColor = tab.hexColor
  state.tabs[i].slug = tab.slug
}

/**
 * Delete a tab.
 * @param {State} state current state.
 * @param {TabModel} tabModel a tab model.
 */
export const deleteTab = (state, tabModel) => {
  state.tabs.splice(tabIndex(modelToTab(tabModel), state.tabs), 1)
}

export const setActive = (state, active) => {
  state.active = active
}

export const setError = (state, error) => {
  console.error(error)
  state.error = error
}
