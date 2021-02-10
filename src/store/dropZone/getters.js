import { itemIndex } from './utils'

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
