exports.name = 'punk-loginkey';

exports.plugin = function(API) {
  API.registerHandler({
    emitter: 'vapor',
    event: 'loginKey'
  }, function(loginKey) {
    var log = API.getLogger();
    var username = API.getConfig().username;
    var fileName = username + '-loginkey';

    log.debug('Received new login key.');

    API.emitEvent('writeFile', fileName, loginKey, function(error) {
      if(error) {
        log.warn('Failed to save login key.');
        log.debug(error);
      }
    });
  });
};
