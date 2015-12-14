var Dispatcher = require('../dispatcher');
var Constants = require('../constants');

var UIActions = {

  logout: function() {
    Dispatcher.dispatch({
      type: Constants.UIActions.LOGOUT
    });
  }

};

module.exports = UIActions;
