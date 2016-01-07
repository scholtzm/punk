var Storage = require('../../storage.js');

exports.name = 'punk-fs';

exports.plugin = function(API) {
  API.registerHandler({emitter: 'vapor', event: 'readFile'}, Storage.get);
  API.registerHandler({emitter: 'plugin', plugin: '*', event: 'readFile'}, Storage.get);
  API.registerHandler({emitter: 'vapor', event: 'writeFile'}, Storage.set);
  API.registerHandler({emitter: 'plugin', plugin: '*', event: 'writeFile'}, Storage.set);
};
