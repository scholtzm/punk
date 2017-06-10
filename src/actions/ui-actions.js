const Dispatcher = require('../dispatcher');
const Constants = require('../constants');

const UIActions = {

  changeNameOpenDialog: function() {
    Dispatcher.dispatch({
      type: Constants.UIActions.UI_CHANGE_NAME_OPEN_DIALOG
    });
  },

  changeNameCloseDialog: function() {
    Dispatcher.dispatch({
      type: Constants.UIActions.UI_CHANGE_NAME_CLOSE_DIALOG
    });
  },

  addFriendOpenDialog: function() {
    Dispatcher.dispatch({
      type: Constants.UIActions.UI_ADD_FRIEND_OPEN_DIALOG
    });
  },

  addFriendCloseDialog: function() {
    Dispatcher.dispatch({
      type: Constants.UIActions.UI_ADD_FRIEND_CLOSE_DIALOG
    });
  },

  logout: function(message) {
    Dispatcher.dispatch({
      type: Constants.UIActions.UI_LOGOUT,
      message: message
    });
  },

  notifyUpdateAvailable: function() {
    Dispatcher.dispatch({
      type: Constants.UIActions.UI_UPDATE_AVAILABLE
    });
  }

};

module.exports = UIActions;
