import Parse from 'parse'

/**
 * @returns {string} current user id
 */
export default () => {
  const currentUser = Parse.User.current()
  console.log(currentUser)

  return currentUser.get('linkedAccount') || currentUser.id
}
