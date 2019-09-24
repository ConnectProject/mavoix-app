import Parse from 'parse'

import Tab, { SLUG_KEY } from '~/models/Tab'
import { NAME_KEY, ASSET_KEY, AVAILABLE_KEY, HIDDEN_KEY, KEY_KEY } from '~/models/TabItem'

export const itemIndex = (item, items) => items.findIndex((pItem) => item.key === pItem.key)

export const modelToTabItem = (itemModel) => ({
  name: itemModel.get(NAME_KEY),
  asset: itemModel.get(ASSET_KEY),
  available: itemModel.get(AVAILABLE_KEY),
  hidden: itemModel.get(HIDDEN_KEY),
  key: itemModel.get(KEY_KEY)
})

export const slugToTabModel = (slug) => {
  return new Parse.Query(Tab)
    .equalTo(SLUG_KEY, slug)
    .first()
}
