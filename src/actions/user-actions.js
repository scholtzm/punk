const Dispatcher = require('../dispatcher');
const Constants = require('../constants');

const UserActions = {

  update(user) {
    Dispatcher.dispatch({
      type: Constants.UserActions.USER_UPDATE,
      user
    });
  },

  changeState(state) {
    Dispatcher.dispatch({
      type: Constants.UserActions.USER_CHANGE_STATE,
      state
    });
  },

  changeName(name) {
    Dispatcher.dispatch({
      type: Constants.UserActions.USER_CHANGE_NAME,
      name
    });
  },

  setWebSession(cookies, sessionid) {
    Dispatcher.dispatch({
      type: Constants.UserActions.USER_SET_WEBSESSION,
      cookies,
      sessionid
    });
  }

};

module.exports = UserActions;
