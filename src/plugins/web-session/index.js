var UserActions = require('../../actions/user-actions.js');

/**
 * Web Session
 * Handles web session changes and sends them to internal store.
 */
exports.name = 'punk-web-session';

exports.plugin = function(API) {
  var log = API.getLogger();

  API.registerHandler({
    emitter: 'vapor',
    event: 'cookies'
  }, function(cookies, sessionid) {
    log.debug('Sending cookies to internal storage.');
    UserActions.setWebSession(cookies, sessionid);
  });
};
