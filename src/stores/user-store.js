const Dispatcher = require('../dispatcher');
const Constants = require('../constants');
const { EventEmitter } = require('events');

const CHANGE_EVENT = 'change';

let _user = {};
let _cookies = [];
let _sessionid;

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

class UserStore extends EventEmitter {

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
    return _user;
  }

  getWebSession() {
    return {
      cookies: _cookies,
      sessionid: _sessionid
    };
  }

};

const userStore = new UserStore();

UserStore.dispatchToken = Dispatcher.register((action) => {
  switch(action.type) {
    case Constants.UserActions.USER_UPDATE:
      update(action.user);
      userStore.emitChange();
      break;

    case Constants.UserActions.USER_SET_WEBSESSION:
      setWebSession(action.cookies, action.sessionid);
      // userStore.emitChange();
      break;

    case Constants.UIActions.UI_LOGOUT:
      clear();
      userStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = userStore;
