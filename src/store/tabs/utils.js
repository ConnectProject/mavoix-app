import { NAME_KEY, HEX_COLOR_KEY, SLUG_KEY } from '~/models/Tab'

export const tabIndex = (tab, tabs) => tabs.findIndex((pTab) => pTab.id === tab.id)

export const modelToTab = (tabModel) => ({
  id: tabModel.id,
  name: tabModel.get(NAME_KEY),
  hexColor: tabModel.get(HEX_COLOR_KEY),
  slug: tabModel.get(SLUG_KEY)
})
