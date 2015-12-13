var Dispatcher = require('../dispatcher');
var Constants = require('../constants');

var UserActions = {

  update: function(user) {
    Dispatcher.dispatch({
      type: Constants.UserActions.USER_UPDATE,
      user: user
    });
  }

};

module.exports = UserActions;
