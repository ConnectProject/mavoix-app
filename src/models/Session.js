import Parse from 'parse'

export const SESSION_ID = 'sessionId '
export const SESSION_START = 'sessionStart'
export const SESSION_END = 'sessionEnd'
export const SESSION_USER = 'sessionUser'

export default class SessionModel extends Parse.Object {
  constructor () {
    super('Session')
  }

  static New (sessionId, sessionUser, sessionStart, sessionEnd) {
    const newSessionModel = new SessionModel()

    newSessionModel.set(SESSION_ID, sessionId)
    newSessionModel.set(SESSION_USER, sessionUser)
    newSessionModel.set(SESSION_START, sessionStart)
    newSessionModel.set(SESSION_END, sessionEnd)
    return newSessionModel
  }

  static Create (sessionId, sessionUser, sessionStart, sessionEnd) {
    console.log('create')
    return SessionModel.New(sessionId, sessionUser, sessionStart, sessionEnd)
  }
}
