var Dispatcher = require('../dispatcher');
var Constants = require('../constants');

var UIActions = {

  changeNameOpenDialog: function() {
    Dispatcher.dispatch({
      type: Constants.UIActions.CHANGE_NAME_OPEN_DIALOG
    });
  },

  changeNameCloseDialog: function() {
    Dispatcher.dispatch({
      type: Constants.UIActions.CHANGE_NAME_CLOSE_DIALOG
    });
  },

  logout: function() {
    Dispatcher.dispatch({
      type: Constants.UIActions.LOGOUT
    });
  }

};

module.exports = UIActions;
