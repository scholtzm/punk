/**
 * Message Dumper
 * Helps with debugging by logging every single Steam message.
 */
exports.name = 'punk-message-dumper';

exports.plugin = function(API) {
  var log = API.getLogger();
  var utils = API.getUtils();
  var Steam = API.getSteam();

  var ignored = {};
  ignored[Steam.EMsg.Multi] = true;

  API.registerHandler({
    emitter: 'client',
    event: 'message'
  }, function(header) {
    if(header.msg in ignored) {
      return;
    }

    log.debug('Received message %d (%s).', header.msg, utils.enumToString(header.msg, Steam.EMsg));
  });
};
