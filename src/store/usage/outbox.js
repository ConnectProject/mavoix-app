import Parse from 'parse'

import getCurrentUserId from '~/utils/getCurrentUserId'

/**
 * Send a queued phrase (see utils/outbox.js).
 * @param {{sessionId: string, timestamp: string, cards: Object[]}} data the phrase, dates as ISO strings
 * @returns {Promise} resolves when saved
 */
export const sendPhrase = ({ sessionId, timestamp, cards }) => (
  new Parse.Object('UsagePhrase').save({ sessionId, user: getCurrentUserId(), timestamp: new Date(timestamp), cards })
)

/**
 * Create the session row, or move its end when it already exists (a session is sent several times as it grows).
 * @param {{sessionId: string, begin: string, end: string}} data the session, dates as ISO strings
 * @returns {Promise} resolves when saved
 */
export const sendSession = async ({ sessionId, begin, end }) => {
  const row = await new Parse.Query('UsageSession').equalTo('sessionId', sessionId).first() ||
    new Parse.Object('UsageSession').set({ sessionId, user: getCurrentUserId(), begin: new Date(begin) })

  return row.save({ end: new Date(end) })
}
