exports.name = 'punk-message-dumper';

exports.plugin = function(API) {
  var log = API.getLogger();
  var utils = API.getUtils();
  var Steam = API.getSteam();

  API.registerHandler({
    emitter: 'client',
    event: 'message'
  }, function(header) {
    log.debug('Received message %d (%s).', header.msg, utils.enumToString(header.msg, Steam.EMsg));
  });
};
