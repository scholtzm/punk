const Dispatcher = require('../dispatcher');
const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');

const CHANGE_EVENT = 'change';

const _settings = {
  checkForUpdatesOnStartup: true
};

const SettingsStore = assign({}, EventEmitter.prototype, {

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

SettingsStore.dispatchToken = Dispatcher.register((action) => {
  switch(action.type) {
    default:
      // ignore
  }
});

module.exports = SettingsStore;
