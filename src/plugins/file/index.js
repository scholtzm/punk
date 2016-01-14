var Storage = require('../../utils/storage.js');

/**
 * File
 * Proxies all file events from Vapor to our Storage module.
 */
exports.name = 'punk-file';

exports.plugin = function(API) {
  API.registerHandler({emitter: 'vapor', event: 'readFile'}, Storage.get);
  API.registerHandler({emitter: 'plugin', plugin: '*', event: 'readFile'}, Storage.get);
  API.registerHandler({emitter: 'vapor', event: 'writeFile'}, Storage.set);
  API.registerHandler({emitter: 'plugin', plugin: '*', event: 'writeFile'}, Storage.set);
};
