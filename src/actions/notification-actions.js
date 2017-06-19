const Dispatcher = require('../dispatcher');
const Constants = require('../constants');

const NotificationActions = {

  updateAll(notifications) {
    Dispatcher.dispatch({
      type: Constants.NotificationActions.NOTIFICATION_UPDATE_ALL,
      notifications
    });
  },

  updateTradeOfferCount(count) {
    Dispatcher.dispatch({
      type: Constants.NotificationActions.NOTIFICATION_UPDATE_TRADEOFFER_COUNT,
      count
    });
  }

};

module.exports = NotificationActions;
