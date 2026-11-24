/**
 * Return all tabs in the order set in the panel: by `order`; tabs without one come last, oldest first.
 * @param {State} state
 */
export const all = ({ tabs }) => {
  const orderOf = (tab) => (typeof tab.order === 'number' ? tab.order : Infinity)

  return [...tabs].sort((a, b) => {
    const diff = orderOf(a) - orderOf(b)

    return diff !== 0 && !Number.isNaN(diff) ? diff : a.createdAt - b.createdAt
  })
}
