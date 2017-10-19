const Dispatcher = require('../../dispatcher');
const Constants = require('../../constants');

/**
 * Presence
 * Handles online state and display name changes.
 */
exports.name = 'punk-presence';

exports.plugin = function(API) {
  const steamFriends = API.getHandler('steamFriends');

  Dispatcher.register((action) => {
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
};
