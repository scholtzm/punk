var Dispatcher = require('../dispatcher');
var Constants = require('../constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var notifier = require('../components/notifier');

var CHANGE_EVENT = 'change';

var _notifications = {};

function _tradeOfferNotification(newCount) {
  if(newCount > _notifications.tradeOffers) {
    var options = {
      title: 'New trade offer',
      message: 'You have new pending trade offer!',
      icon: false,
      wait: true,
      sticky: true,
      url: 'https://steamcommunity.com/my/tradeoffers'
    };

    notifier.notify(options);
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

var NotificationStore = assign({}, EventEmitter.prototype, {

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

NotificationStore.dispatchToken = Dispatcher.register(function(action) {
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
