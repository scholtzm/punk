var Dispatcher = require('../dispatcher');
var Constants = require('../constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _user = {};
var _cookies = [];
var _sessionid;

function update(user) {
  _user = user;
}

function clear() {
  _user = {};
  _cookies = [];
  _sessionid = undefined;
}

function setWebSession(cookies, sessionid) {
  _cookies = cookies;
  _sessionid = sessionid;
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
  },

  getWebSession: function() {
    return {
      cookies: _cookies,
      sessionid: _sessionid
    };
  }

});

UserStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case Constants.UserActions.USER_UPDATE:
      update(action.user);
      UserStore.emitChange();
      break;

    case Constants.UserActions.USER_SET_WEBSESSION:
      setWebSession(action.cookies, action.sessionid);
      // UserStore.emitChange();
      break;

    case Constants.UIActions.UI_LOGOUT:
      clear();
      UserStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = UserStore;
