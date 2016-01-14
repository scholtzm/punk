var Logger = require('../../utils/logger.js');

/**
 * Logger
 * Proxies all 'message:*' events to our internal Logger module.
 */
exports.name = 'punk-logger';

exports.plugin = function(API) {
  API.registerHandler({
    emitter: '*',
    event: 'message:debug'
  }, function(message) {
    Logger.debug(message);
  });

  API.registerHandler({
    emitter: '*',
    event: 'message:info'
  }, function(message) {
    Logger.info(message);
  });

  API.registerHandler({
    emitter: '*',
    event: 'message:warn'
  }, function(message) {
    Logger.warn(message);
  });

  API.registerHandler({
    emitter: '*',
    event: 'message:error'
  }, function(message) {
    Logger.error(message);
  });
};
