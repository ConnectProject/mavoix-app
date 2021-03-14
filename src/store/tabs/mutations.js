import { modelToTab, tabIndex } from './utils'

function storeTabs (tabs) {
  localStorage.tabs = JSON.stringify(tabs)
}

/**
 * Initiate Tabs for saved state
 * @param {State} state
 */
export const InitiateState = (state) => {
  state.tabs = localStorage.tabs ? JSON.parse(localStorage.tabs) : []
}

/**
 * Set tabs.
 * @param {State} state
 * @param {[TabModel]} tabsModel array of tabs models.
 */
export const setTabs = (state, tabsModel) => {
  state.tabs = tabsModel.map((tabModel) => {
    return modelToTab(tabModel)
  })
  storeTabs(state.tabs)
}

/**
 * Add a tab.
 * @param {State} state
 * @param {TabModel} tabModel a tab model.
 */
export const addTab = (state, tabModel) => {
  state.tabs.push(modelToTab(tabModel))
  storeTabs(state.tabs)
}

/**
 * Update a tab.
 * @param {State} state
 * @param {TabModel} tabModel a tab model.
 */
export const updateTab = (state, tabModel) => {
  const tab = modelToTab(tabModel)
  const i = tabIndex(tab, state.tabs)

  state.tabs[i].name = tab.name
  state.tabs[i].hexColor = tab.hexColor
  state.tabs[i].slug = tab.slug
  storeTabs(state.tabs)
}

/**
 * Delete a tab.
 * @param {State} state
 * @param {TabModel} tabModel a tab model.
 */
export const deleteTab = (state, tabModel) => {
  state.tabs.splice(tabIndex(modelToTab(tabModel), state.tabs), 1)
  storeTabs(state.tabs)
}

/**
 * Set the active tab
 * @param {State} state
 * @param {Tab} active a tab object
 */
export const setActive = (state, active) => {
  state.active = active
  localStorage.active = state.active
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
