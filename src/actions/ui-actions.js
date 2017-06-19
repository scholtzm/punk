const Dispatcher = require('../dispatcher');
const Constants = require('../constants');

const UIActions = {

  changeNameOpenDialog() {
    Dispatcher.dispatch({
      type: Constants.UIActions.UI_CHANGE_NAME_OPEN_DIALOG
    });
  },

  changeNameCloseDialog() {
    Dispatcher.dispatch({
      type: Constants.UIActions.UI_CHANGE_NAME_CLOSE_DIALOG
    });
  },

  addFriendOpenDialog() {
    Dispatcher.dispatch({
      type: Constants.UIActions.UI_ADD_FRIEND_OPEN_DIALOG
    });
  },

  addFriendCloseDialog() {
    Dispatcher.dispatch({
      type: Constants.UIActions.UI_ADD_FRIEND_CLOSE_DIALOG
    });
  },

  logout(message) {
    Dispatcher.dispatch({
      type: Constants.UIActions.UI_LOGOUT,
      message
    });
  },

  notifyUpdateAvailable() {
    Dispatcher.dispatch({
      type: Constants.UIActions.UI_UPDATE_AVAILABLE
    });
  }

};

module.exports = UIActions;
