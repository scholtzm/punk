var Dispatcher = require('../../dispatcher');
var Constants = require('../../constants');

/**
 * Presence
 * Handles online state and display name changes.
 */
exports.name = 'punk-presence';

exports.plugin = function(API) {
  var steamFriends = API.getHandler('steamFriends');

  var token = Dispatcher.register(function(action) {
    switch(action.type) {
      case Constants.UserActions.USER_CHANGE_STATE:
        steamFriends.setPersonaState(action.state);
        break;

      case Constants.UserActions.USER_CHANGE_NAME:
        steamFriends.setPersonaName(action.name);
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
