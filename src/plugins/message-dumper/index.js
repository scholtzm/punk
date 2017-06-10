/**
 * Message Dumper
 * Helps with debugging by logging every single Steam message.
 */
exports.name = 'punk-message-dumper';

exports.plugin = function(API) {
  const log = API.getLogger();
  const utils = API.getUtils();
  const Steam = API.getSteam();

  const ignored = {};
  ignored[Steam.EMsg.Multi] = true;

  API.registerHandler({
    emitter: 'client',
    event: 'message'
  }, (header) => {
    if(header.msg in ignored) {
      return;
    }

    log.debug('Received message %d (%s).', header.msg, utils.enumToString(header.msg, Steam.EMsg));
  });
};
