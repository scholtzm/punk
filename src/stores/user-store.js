var Dispatcher = require('../dispatcher');
var Constants = require('../constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _user = {};

function update(user) {
  _user = user;
}

function clear() {
  _user = {};
}

var UserStore = assign({}, EventEmitter.prototype, {

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
    return _user;
  }

});

UserStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case Constants.UserActions.USER_UPDATE:
      update(action.user);
      UserStore.emitChange();
      break;

    case Constants.UIActions.LOGOUT:
      clear();
      UserStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = UserStore;
