var Dispatcher = require('../../dispatcher');
var Constants = require('../../constants');

exports.name = 'punk-friends';

exports.plugin = function(API) {
  var Steam = API.getSteam();
  var steamFriends = API.getHandler('steamFriends');
  var log = API.getLogger();

  var token = Dispatcher.register(function(action) {
    switch(action.type) {
      case Constants.FriendsActions.REMOVE:
        steamFriends.removeFriend(action.friend.id);
        log.info('User %s has been removed from friends.', action.friend.id);
        break;

      case Constants.FriendsActions.BLOCK:
        steamFriends.setIgnoreFriend(action.friend.id, true, function(result) {
          if(result === Steam.EResult.OK) {
            // TODO call FriendsAction which confirms blockage
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
    plugin: 'punk-logout',
    event: 'logout'
  }, function() {
    Dispatcher.unregister(token);
  });
};
