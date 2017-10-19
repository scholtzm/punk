const UserActions = require('../../actions/user-actions.js');
const Logger = require('../../utils/logger.js')('plugin:websession');

/**
 * Web Session
 * Handles web session changes and sends them to internal store.
 */
module.exports = function webSessionPlugin(steamUser) {
  steamUser.on('webSession', (cookies, sessionid) => {
    Logger.debug('Sending cookies to internal storage.');
    UserActions.setWebSession(cookies, sessionid);
  });
};
