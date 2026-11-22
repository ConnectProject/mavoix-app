import { flush, registerHandler } from '~/utils/outbox'
import { sendPhrase, sendSession } from '~/store/usage/outbox'
import { sendConnect } from '~/store/stats/outbox'

const FLUSH_EVERY_MS = 60 * 1000

/**
 * Offline support: ask the browser not to evict our data, and send the waiting messages whenever
 * the connection may be back (online event, app visible again, every minute; the events are not reliable in a WebView).
 */
export default ({ store }) => {
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().catch(() => {})
  }
  registerHandler('usage-phrase', sendPhrase)
  registerHandler('usage-session', sendSession)
  registerHandler('connect-post', (data) => sendConnect(store, data))

  const sync = () => {
    if (document.visibilityState === 'visible') {
      flush()
    }
  }
  window.addEventListener('online', () => {
    flush()
    store.dispatch('tabs/refresh')
    store.dispatch('dropZone/refresh')
  })
  document.addEventListener('visibilitychange', sync)
  setInterval(sync, FLUSH_EVERY_MS)
  sync()
}
