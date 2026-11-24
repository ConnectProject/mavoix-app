import { itemIndex } from './utils'

/**
 * Return tab's color
 * @param State state
 */
export const hexColor = ({ tab: { color } }) => color
export const language = ({ tab: { language } }) => language
export const speed = ({ tab: { speed } }) => speed

/**
 * @returns {'small'|'medium'|'large'}
 */
export const imageSizeKey = ({ tab: { imageSize } }) =>
  imageSize === 'small' || imageSize === 'large' ? imageSize : 'medium'

/**
 * @returns {string} BEM suffix for ItemCard / strip (card--small, …)
 */
export const imageSizeClass = (state) => state.deviceImageScale === null ? `card--${imageSizeKey(state)}` : 'card--custom'

/**
 * @returns {string} modifier on sentence strip (active-strip--small, …)
 */
export const activeStripClass = (state) => state.deviceImageScale === null ? `active-strip--${imageSizeKey(state)}` : 'active-strip--custom'

/**
 * Return all unactive items
 * @param State state
 */
export const items = ({ items, activeItems }) => (
  items.map(item => ({ ...item, active: itemIndex(item, activeItems) > -1 }))
)

/**
 * Return all active items
 * @param State state
 */
export const activeItems = ({ activeItems }) => activeItems

/**
 * Return Parse Subscription
 * @param State state
 */
export const subscription = ({ subscription }) => subscription

/**
 * @returns {(number|null)} image scale chosen for this device (0-100), null when it follows the tab's image size
 */
export const deviceImageScale = ({ deviceImageScale }) => deviceImageScale
