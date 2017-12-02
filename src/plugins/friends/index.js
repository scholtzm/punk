const SteamUser = require('steam-user');

const Logger = require('../../utils/logger')('plugin:friends');
const Dispatcher = require('../../dispatcher');
const Constants = require('../../constants');

/**
 * Friends
 * Adds support for friends list actions such as adding, removing
 * or blocking.
 */
module.exports = function(steamUser) {
  Dispatcher.register((action) => {
    switch(action.type) {
      case Constants.FriendsActions.FRIENDS_ADD:
        steamUser.addFriend(action.id);
        Logger.info('User %s has been sent a friend request.', action.id);
        break;

      case Constants.FriendsActions.FRIENDS_REMOVE:
        steamUser.removeFriend(action.friend.id);
        Logger.info('User %s has been removed from friends.', action.friend.id);
        break;

      case Constants.FriendsActions.FRIENDS_BLOCK:
        steamUser.blockUser(action.friend.id, (result) => {
          if(result === SteamUser.EResult.OK) {
            Logger.info('User %s has been blocked.', action.friend.id);
          } else {
            Logger.warn('Failed to block %s with EResult %d.', action.friend.id, result);
          }
        });
        break;

      case Constants.FriendsActions.FRIENDS_UNBLOCK:
        steamUser.unblockUser(action.friend.id, (result) => {
          if(result === SteamUser.EResult.OK) {
            Logger.info('User %s has been unblocked.', action.friend.id);
          } else {
            Logger.warn('Failed to unblock %s with EResult %d.', action.friend.id, result);
          }
        });
        break;

      default:
        // ignore
    }
  });
};
