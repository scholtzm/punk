var Dispatcher = require('../dispatcher');
var Constants = require('../constants');

var SettingsActions = {

  notifyUpdateAvailable: function() {
    Dispatcher.dispatch({
      type: Constants.SettingsActions.SETTINGS_NOTIFY_UPDATE_AVAILABLE
    });
  }

};

module.exports = SettingsActions;
