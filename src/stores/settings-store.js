var Dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _settings = {
  checkForUpdatesOnStartup: true
};

var SettingsStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get: function() {
    return _settings;
  }

});

SettingsStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    default:
      // ignore
  }
});

module.exports = SettingsStore;
