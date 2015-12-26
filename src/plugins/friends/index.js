var Dispatcher = require('../../dispatcher');
var Constants = require('../../constants');

var FriendsActions = require('../../actions/friends-actions.js');

exports.name = 'punk-friends';

exports.plugin = function(API) {
  var Steam = API.getSteam();
  var steamFriends = API.getHandler('steamFriends');
  var log = API.getLogger();

  var token = Dispatcher.register(function(action) {
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
        steamFriends.setIgnoreFriend(action.friend.id, true, function(result) {
          if(result === Steam.EResult.OK) {
            FriendsActions.purge(action.friend.id);
            log.info('User %s has been blocked.', action.friend.id);
          } else {
            log.warn('Failed to block %s with EResult %d.', action.friend.id, result);
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
  }, function() {
    Dispatcher.unregister(token);
  });
};
