/**
 * Return tab's color
 * @param State state
 */
export const hexColor = ({ tab: { color } }) => color
export const language = ({ tab: { language } }) => language
export const speed = ({ tab: { speed } }) => speed

/**
 * Return all unactive items
 * @param State state
 */
export const items = ({ items }) => items

/**
 * Return all active items
 * @param State state
 */
export const activeItems = ({ items, dropPosition }) => {
  const activeItems = items.filter(item => item.activeOrder)
    .sort((a, b) => a.activeOrder < b.activeOrder ? -1 : (a.activeOrder > b.activeOrder ? 1 : 0))
  if (dropPosition !== null) {
    activeItems.splice(dropPosition, 0, { 'drop': true })
  }
  return activeItems
}

/**
 * Return Parse Subscription
 * @param State state
 */
export const subscription = ({ subscription }) => subscription
