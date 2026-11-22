import { get, put, remove, getAllKeys } from '~/utils/offlineDb'

/*
 * Pictures kept in IndexedDB (as blobs) so that the cards show without internet.
 * `objectUrls` keeps the blob: URL of the pictures already read, so that a card can show its picture at once.
 */
const objectUrls = new Map()
const pending = new Map()
const PARALLEL_DOWNLOADS = 4

const isRemote = (url) => typeof url === 'string' && /^https?:/.test(url)

/**
 * @param {string} url picture address
 * @returns {(string|null)} usable address when the picture was already read from the cache in this run
 */
export const peekImage = (url) => objectUrls.get(url) || null

/**
 * @param {string} url picture address
 * @returns {Promise<(string|null)>} blob: address of the cached picture, null when it is not cached
 */
export const cachedImage = async (url) => {
  if (!isRemote(url)) {
    return null
  }
  if (objectUrls.has(url)) {
    return objectUrls.get(url)
  }
  try {
    const blob = await get('images', url)
    if (blob) {
      objectUrls.set(url, URL.createObjectURL(blob))
    }

    return objectUrls.get(url) || null
  } catch (err) {
    return null
  }
}

/**
 * Download a picture and keep it. Concurrent calls for one address share the download.
 * @param {string} url picture address
 * @returns {Promise<boolean>} true when the picture is in the cache; never rejects
 */
export const downloadImage = (url) => {
  if (!isRemote(url)) {
    return Promise.resolve(false)
  }
  if (!pending.has(url)) {
    const job = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status)
        }

        return response.blob()
      })
      .then((blob) => put('images', url, blob))
      .then(() => true)
      .catch(() => false)
      .finally(() => pending.delete(url))
    pending.set(url, job)
  }

  return pending.get(url)
}

const downloadNext = async (queue) => {
  const url = queue.shift()
  if (!url) {
    return
  }
  try {
    if (!(await get('images', url))) {
      await downloadImage(url)
    }
  } catch (err) {
    // ignore: the picture will be fetched the next time
  }
  await downloadNext(queue)
}

/**
 * Download the pictures that are not cached yet, and forget the ones that are no longer used.
 * @param {string[]} urls every picture of the account
 * @returns {Promise} resolves when done; never rejects
 */
export const syncImages = async (urls) => {
  const wanted = new Set(urls.filter(isRemote))
  const queue = [...wanted]
  await Promise.all(Array.from({ length: PARALLEL_DOWNLOADS }, () => downloadNext(queue)))
  try {
    const stored = await getAllKeys('images')
    await Promise.all(stored.filter((url) => !wanted.has(url)).map((url) => {
      objectUrls.delete(url)

      return remove('images', url)
    }))
  } catch (err) {
    console.warn('image cache not cleaned:', err)
  }
}
