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
  }

};

module.exports = UserActions;
