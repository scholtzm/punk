const Logger = require('../../utils/logger.js')('vapor');

/**
 * Logger
 * Proxies all 'message:*' events to our internal Logger module.
 */
exports.name = 'punk-logger';

exports.plugin = function(API) {
  API.registerHandler({
    emitter: '*',
    event: 'message:debug'
  }, (message) => {
    Logger.debug(message);
  });

  API.registerHandler({
    emitter: '*',
    event: 'message:info'
  }, (message) => {
    Logger.info(message);
  });

  API.registerHandler({
    emitter: '*',
    event: 'message:warn'
  }, (message) => {
    Logger.warn(message);
  });

  API.registerHandler({
    emitter: '*',
    event: 'message:error'
  }, (message) => {
    Logger.error(message);
  });
};
