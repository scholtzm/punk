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

  addFriendOpenDialog: function() {
    Dispatcher.dispatch({
      type: Constants.UIActions.ADD_FRIEND_OPEN_DIALOG
    });
  },

  addFriendCloseDialog: function() {
    Dispatcher.dispatch({
      type: Constants.UIActions.ADD_FRIEND_CLOSE_DIALOG
    });
  },

  logout: function() {
    Dispatcher.dispatch({
      type: Constants.UIActions.LOGOUT
    });
  }

};

module.exports = UIActions;
