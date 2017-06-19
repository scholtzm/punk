/**
 * Login Key
 * Saves user's credentials after we successfully log in.
 */
exports.name = 'punk-loginkey';

exports.plugin = function(API) {
  API.registerHandler({
    emitter: 'vapor',
    event: 'loginKey'
  }, (loginKey) => {
    const log = API.getLogger();
    const username = API.getConfig().username;

    const user = {
      username,
      loginKey: loginKey.toString()
    };

    log.debug('Received new login key.');

    API.emitEvent('writeFile', { fileName: 'user.json', value: JSON.stringify(user, null, 2) }, (error) => {
      if(error) {
        log.warn('Failed to save user data.');
        log.debug(error);
      }
    });
  });
};
