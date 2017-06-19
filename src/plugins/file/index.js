const Storage = require('../../utils/storage.js');

/**
 * File
 * Proxies all file events from Vapor to our Storage module.
 */
exports.name = 'punk-file';

exports.plugin = function(API) {
  const username = API.getConfig().username;
  const sanitizedUsername = username.toLowerCase();

  API.registerHandler({ emitter: 'vapor', event: 'readFile' }, (fileName, callback) => {
    Storage.get({ prefix: sanitizedUsername, fileName }, callback);
  });

  API.registerHandler({ emitter: 'plugin', plugin: '*', event: 'readFile' }, Storage.get);

  API.registerHandler({ emitter: 'vapor', event: 'writeFile' }, (fileName, value, callback) => {
    Storage.set({ prefix: sanitizedUsername, fileName, value }, callback);
  });

  API.registerHandler({ emitter: 'plugin', plugin: '*', event: 'writeFile' }, Storage.set);
};
