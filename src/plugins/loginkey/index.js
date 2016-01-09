exports.name = 'punk-loginkey';

exports.plugin = function(API) {
  API.registerHandler({
    emitter: 'vapor',
    event: 'loginKey'
  }, function(loginKey) {
    var log = API.getLogger();
    var username = API.getConfig().username;

    var user = {
      username: username,
      loginKey: loginKey.toString()
    };

    log.debug('Received new login key.');

    API.emitEvent('writeFile', 'user.json', JSON.stringify(user, null, 2), function(error) {
      if(error) {
        log.warn('Failed to save login key.');
        log.debug(error);
      }
    });
  });
};
