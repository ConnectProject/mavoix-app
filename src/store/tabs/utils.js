import { NAME_KEY, HEX_COLOR_KEY, SLUG_KEY } from '~/models/Tab'

/**
 * Find a tab's index
 * @param {TabModel} tab a tab model
 * @param {[TabModel]} tabs an array of tabs models.
 */
export const tabIndex = (tab, tabs) => tabs.findIndex((pTab) => pTab.id === tab.id)

/**
 * Convert a model to an object
 * @param {TabModel} tabModel a tab model.
 */
export const modelToTab = (tabModel) => ({
  id: tabModel.id,
  name: tabModel.get(NAME_KEY),
  hexColor: tabModel.get(HEX_COLOR_KEY),
  slug: tabModel.get(SLUG_KEY)
})
