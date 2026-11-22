import Parse from 'parse'

import TabItemModel, { TAB_KEY, ORDER_KEY, ASSET_KEY } from '~/models/TabItem'
import { assetFromModel } from '~/store/dropZone/utils'
import { saveObjects } from '~/utils/dataCache'
import { syncImages } from '~/utils/imageCache'

/**
 * Keep a copy of the cards of every tab, and of their pictures, so that all the tabs work without internet.
 * @param {Parse.Object[]} tabModels the tabs of the account
 * @returns {Promise} resolves when done; never rejects
 */
export const syncOfflineData = async (tabModels) => {
  if (navigator.onLine === false || !tabModels.length) {
    return
  }
  try {
    const items = await new Parse.Query(TabItemModel).containedIn(TAB_KEY, tabModels).include(ASSET_KEY).limit(10000).find()
    const byTab = {}
    items.forEach((item) => {
      const tabId = item.get(TAB_KEY).id
      byTab[tabId] = (byTab[tabId] || []).concat(item)
    })
    await Promise.all(tabModels.map((tab) => saveObjects(
      `items:${tab.id}`,
      (byTab[tab.id] || []).sort((a, b) => a.get(ORDER_KEY) - b.get(ORDER_KEY))
    )))
    await syncImages(items.map((item) => assetFromModel(item.get(ASSET_KEY)).url))
  } catch (err) {
    console.warn('offline copy not updated:', err)
  }
}
