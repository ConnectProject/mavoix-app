/*
 * Tiny promise wrapper around IndexedDB, used for everything the app keeps to work without internet.
 *   json    key -> JSON   cached Parse data (tabs, items of each tab)
 *   images  url -> Blob   cached pictures
 *   outbox  auto id       messages waiting for a connection (see utils/outbox.js)
 */
const DB_NAME = 'mavoix-offline'

let dbPromise = null

const open = () => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1)
      request.onupgradeneeded = () => {
        const db = request.result
        db.createObjectStore('json')
        db.createObjectStore('images')
        db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true })
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    dbPromise.catch(() => { dbPromise = null })
  }

  return dbPromise
}

/**
 * @param {string} storeName object store
 * @param {string} mode readonly | readwrite
 * @param {function(IDBObjectStore): IDBRequest} fn the operation
 * @returns {Promise<*>} result of the request, once the transaction is complete
 */
const run = async (storeName, mode, fn) => {
  const db = await open()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode)
    const request = fn(tx.objectStore(storeName))
    tx.oncomplete = () => resolve(request.result)
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export const get = (store, key) => run(store, 'readonly', (s) => s.get(key))
export const getAll = (store) => run(store, 'readonly', (s) => s.getAll())
export const getAllKeys = (store) => run(store, 'readonly', (s) => s.getAllKeys())
export const put = (store, key, value) => run(store, 'readwrite', (s) => key === undefined ? s.put(value) : s.put(value, key))
export const remove = (store, key) => run(store, 'readwrite', (s) => s.delete(key))
