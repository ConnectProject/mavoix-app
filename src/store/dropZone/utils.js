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

import getCurrentUserId from '~/utils/getCurrentUserId'

/**
 * Return the index of a tab in a list of tabs
 * @param {TabItem} item needle
 * @param {[TabItem]} items haystack
 */
export const itemIndex = (item, items) => (
  items.findIndex((pItem) => item.key === pItem.key)
)

export const assetFromModel = (assetModel) => {
  try {
    const parseFile = assetModel.get('file')
    // update asset url if asset is a Parse file
    const url = parseFile
      ? parseFile.url()
      // ? `${Parse.serverURL}/files/${Parse.applicationId}/${parseFile._name}`
      : assetModel.get('url')

    return {
      id: assetModel.id,
      name: assetModel.get('name'),
      url: url,
      file: parseFile
    }
  } catch (e) {
    console.log(e)
    return {}
  }
}

export const modelToTabItem = (itemModel) => {
  const asset = assetFromModel(itemModel.get(ASSET_KEY))
  return {
    name: itemModel.get(NAME_KEY),
    asset,
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
    .equalTo('user', getCurrentUserId())
    .first()
}
