var Dispatcher = require('../dispatcher');
var Constants = require('../constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _settings = {
  checkForUpdatesOnStartup: true
};

let _updateAvailable = false;

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
  },

  getUpdateAvailable() {
    return _updateAvailable;
  },

  markUpdateAsAvailable: function() {
    _updateAvailable = true;
  }

});

SettingsStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case Constants.SettingsActions.SETTINGS_NOTIFY_UPDATE_AVAILABLE:
      SettingsStore.markUpdateAsAvailable();
      SettingsStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = SettingsStore;
