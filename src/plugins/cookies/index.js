var UserActions = require('../../actions/user-actions.js');

exports.name = 'punk-cookies';

exports.plugin = function(API) {
  var log = API.getLogger();

  API.registerHandler({
    emitter: 'vapor',
    event: 'cookies'
  }, function(cookies, sessionid) {
    log.debug('Sending cookies to internal storage.');
    UserActions.setCookies(cookies, sessionid);
  });
};
