const Dispatcher = require('../../dispatcher');
const Constants = require('../../constants');

/**
 * Presence
 * Handles online state and display name changes.
 */
module.exports = function(steamUser) {
  Dispatcher.register((action) => {
    switch(action.type) {
      case Constants.UserActions.USER_CHANGE_STATE:
        steamUser.setPersona(action.state);
        break;

      case Constants.UserActions.USER_CHANGE_NAME:
        steamUser.setPersona(null, action.name);
        break;

      default:
        // ignore
    }
  });
};
