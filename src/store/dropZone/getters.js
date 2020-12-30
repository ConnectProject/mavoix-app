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
export const activeItems = ({ activeItems }) => activeItems

/**
 * Return Parse Subscription
 * @param State state
 */
export const subscription = ({ subscription }) => subscription
