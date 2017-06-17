const { EventEmitter } = require('events');

const Dispatcher = require('../dispatcher');
const Constants = require('../constants');
const notifier = require('../ui/notifier');

const CHANGE_EVENT = 'change';

let _notifications = {};

function _tradeOfferNotification(newCount) {
  if(newCount > _notifications.tradeOffers) {
    notifier.tradeOffer();
  }
}

function updateAll(notifications) {
  _tradeOfferNotification(notifications.tradeOffers);
  _notifications = notifications;
}

function updateTradeOfferCount(count) {
  _tradeOfferNotification(count);
  _notifications.tradeOffers = count;
}

function clear() {
  _notifications = {};
}

class NotificationStore extends EventEmitter {

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  get() {
    return _notifications;
  }

};

const notificationStore = new NotificationStore();

NotificationStore.dispatchToken = Dispatcher.register((action) => {
  switch(action.type) {
    case Constants.NotificationActions.NOTIFICATION_UPDATE_TRADEOFFER_COUNT:
      updateTradeOfferCount(action.count);
      notificationStore.emitChange();
      break;

    case Constants.NotificationActions.NOTIFICATION_UPDATE_ALL:
      updateAll(action.notifications);
      notificationStore.emitChange();
      break;

    case Constants.UIActions.UI_LOGOUT:
      clear();
      notificationStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = notificationStore;
