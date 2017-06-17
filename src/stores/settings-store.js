const { EventEmitter } = require('events');

const Dispatcher = require('../dispatcher');

const CHANGE_EVENT = 'change';

const _settings = {
  checkForUpdatesOnStartup: true
};

class SettingsStore extends EventEmitter {

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  get() {
    return _settings;
  }

};

const settingsStore = new SettingsStore();

SettingsStore.dispatchToken = Dispatcher.register((action) => {
  switch(action.type) {
    default:
      // ignore
  }
});

module.exports = settingsStore;
