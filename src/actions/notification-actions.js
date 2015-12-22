var Dispatcher = require('../dispatcher');
var Constants = require('../constants');

var NotificationActions = {

  updateAll: function(notifications) {
    Dispatcher.dispatch({
      type: Constants.NotificationActions.NOTIFICATION_UPDATE_ALL,
      notifications: notifications
    });
  },

  updateTradeOfferCount: function(count) {
    Dispatcher.dispatch({
      type: Constants.NotificationActions.NOTIFICATION_UPDATE_TRADEOFFER_COUNT,
      count: count
    });
  }

};

module.exports = NotificationActions;
