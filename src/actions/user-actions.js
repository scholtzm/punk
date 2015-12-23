var Dispatcher = require('../dispatcher');
var Constants = require('../constants');

var UserActions = {

  update: function(user) {
    Dispatcher.dispatch({
      type: Constants.UserActions.USER_UPDATE,
      user: user
    });
  },

  changeState: function(state) {
    Dispatcher.dispatch({
      type: Constants.UserActions.USER_CHANGE_STATE,
      state: state
    });
  },

  changeName: function(name) {
    Dispatcher.dispatch({
      type: Constants.UserActions.USER_CHANGE_NAME,
      name: name
    });
  },

  setCookies: function(cookies, sessionid) {
    Dispatcher.dispatch({
      type: Constants.UserActions.USER_SET_COOKIES,
      cookies: cookies,
      sessionid: sessionid
    });
  }

};

module.exports = UserActions;
