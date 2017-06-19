const Dispatcher = require('../../dispatcher');
const Constants = require('../../constants');

/**
 * Friends
 * Adds support for friends list actions such as adding, removing
 * or blocking.
 */
exports.name = 'punk-friends';

exports.plugin = function(API) {
  const Steam = API.getSteam();
  const steamFriends = API.getHandler('steamFriends');
  const log = API.getLogger();

  const token = Dispatcher.register((action) => {
    switch(action.type) {
      case Constants.FriendsActions.FRIENDS_ADD:
        steamFriends.addFriend(action.id);
        log.info('User %s has been sent a friend request.', action.id);
        break;

      case Constants.FriendsActions.FRIENDS_REMOVE:
        steamFriends.removeFriend(action.friend.id);
        log.info('User %s has been removed from friends.', action.friend.id);
        break;

      case Constants.FriendsActions.FRIENDS_BLOCK:
        steamFriends.setIgnoreFriend(action.friend.id, true, (result) => {
          if(result === Steam.EResult.OK) {
            log.info('User %s has been blocked.', action.friend.id);
          } else {
            log.warn('Failed to block %s with EResult %d.', action.friend.id, result);
          }
        });
        break;

      case Constants.FriendsActions.FRIENDS_UNBLOCK:
        steamFriends.setIgnoreFriend(action.friend.id, false, (result) => {
          if(result === Steam.EResult.OK) {
            log.info('User %s has been unblocked.', action.friend.id);
          } else {
            log.warn('Failed to unblock %s with EResult %d.', action.friend.id, result);
          }
        });
        break;

      default:
        // ignore
    }
  });

  API.registerHandler({
    emitter: 'plugin',
    plugin: '*',
    event: 'logout'
  }, () => {
    Dispatcher.unregister(token);
  });
};
