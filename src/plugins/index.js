/**
 * Punk's built-in plugins
 * Sorted alphabetically
 */
module.exports = {
  file: require('./file'),
  loggedOn: require('./loggedon'),
  loginKey: require('./loginkey'),
  messageDumper: require('./message-dumper'),
  steamGuard: require('./steamguard'),

  disconnected: require('./disconnected'),
  friendMsg: require('./friendmsg'),
  friends: require('./friends'),
  chatLogger: require('./chat-logger'),
  logout: require('./logout'),
  notifications: require('./notifications'),
  offlineMessages: require('./offline-messages'),
  personaState: require('./personastate'),
  presence: require('./presence'),
  trade: require('./trade'),
  webSession: require('./web-session')
};
