const Dispatcher = require('../dispatcher');
const Constants = require('../constants');
const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');
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

const NotificationStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get: function() {
    return _notifications;
  }

});

NotificationStore.dispatchToken = Dispatcher.register((action) => {
  switch(action.type) {
    case Constants.NotificationActions.NOTIFICATION_UPDATE_TRADEOFFER_COUNT:
      updateTradeOfferCount(action.count);
      NotificationStore.emitChange();
      break;

    case Constants.NotificationActions.NOTIFICATION_UPDATE_ALL:
      updateAll(action.notifications);
      NotificationStore.emitChange();
      break;

    case Constants.UIActions.UI_LOGOUT:
      clear();
      NotificationStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = NotificationStore;
