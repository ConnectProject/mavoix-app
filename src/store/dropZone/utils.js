import Parse from 'parse'

import Tab, { SLUG_KEY } from '~/models/Tab'
import {
  NAME_KEY,
  ASSET_KEY,
  AVAILABLE_KEY,
  HIDDEN_KEY,
  KEY_KEY,
  ORDER_KEY,
  TAB_KEY
} from '~/models/TabItem'

import getCurrentUser from '~/utils/getCurrentUser'

/**
 * Return the index of a tab in a list of tabs
 * @param {TabItem} item needle
 * @param {[TabItem]} items haystack
 */
export const itemIndex = (item, items) => (
  items.findIndex((pItem) => item.key === pItem.key)
)

export const modelToTabItem = (itemModel) => {
  var asset = itemModel.get(ASSET_KEY)
  const parseFile = asset.file
  // update asset url if asset is a Parse file
  if (parseFile) {
    asset.url = `${Parse.serverURL}/files/${Parse.applicationId}/${parseFile._name}`
  }
  return {
    name: itemModel.get(NAME_KEY),
    asset: asset,
    available: itemModel.get(AVAILABLE_KEY),
    hidden: itemModel.get(HIDDEN_KEY),
    key: itemModel.get(KEY_KEY),
    order: itemModel.get(ORDER_KEY),
    tabSlug: itemModel.get(TAB_KEY).get(SLUG_KEY)
  }
}

export const slugToTabModel = (slug) => {
  return new Parse.Query(Tab)
    .equalTo(SLUG_KEY, slug)
    .equalTo('user', getCurrentUser())
    .first()
}
