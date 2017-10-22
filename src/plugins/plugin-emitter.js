const { EventEmitter } = require('events');

class PluginEmitter extends EventEmitter {}

module.exports = new PluginEmitter();
