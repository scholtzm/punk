var request = require('request');
var NotificationActions = require('../../actions/notification-actions.js');

/**
 * Notifications
 * Handles Steam's notifications.
 * TODO switch completely to Steam messages?
 */
exports.name = 'punk-notifications';

exports.plugin = function(API) {
  var TIMEOUT = 20000;
  var STEAMCOMMUNITY = 'https://steamcommunity.com';
  var NOTIFICATIONS_URL = STEAMCOMMUNITY + '/actions/GetNotificationCounts';

  var log = API.getLogger();
  var jar = request.jar();
  var req = request.defaults({ jar: jar });

  var interval;

  function getNotifications() {
    var options = {
      uri: NOTIFICATIONS_URL,
      json: true
    };

    req.get(options, function(error, response, body) {
      if(body === null || body === undefined) {
        clearInterval(interval);
        // Vapor will keep repeating until successful
        API.webLogOn();
        return;
      }

      // abort if Steam goes full retard
      if(typeof body === 'string') {
        return;
      }

      var notifications = {
        tradeOffers: body.notifications[1] || 0,
        gameTurns: body.notifications[2] || 0,
        moderatorMessages: body.notifications[3] || 0,
        comments: body.notifications[4] || 0,
        items: body.notifications[5] || 0,
        invites: body.notifications[6] || 0,
        // No clue about 7
        gifts: body.notifications[8] || 0,
        messages: body.notifications[9] || 0,
        helpRequestReplies: body.notifications[10] || 0,
        accountAlerts: body.notifications[11] || 0
      };

      NotificationActions.updateAll(notifications);
    });
  }

  API.registerHandler({
    emitter: 'vapor',
    event: 'cookies'
  }, function(cookies) {
    cookies.forEach(function(cookie) {
      jar.setCookie(request.cookie(cookie), STEAMCOMMUNITY);
    });

    clearInterval(interval);
    getNotifications();
    interval = setInterval(getNotifications, TIMEOUT);
  });

  API.registerHandler({
    emitter: 'steamUser',
    event: 'tradeOffers'
  }, function(count) {
    log.debug('Pending trade offer count: %d.', count);
    NotificationActions.updateTradeOfferCount(count);
  });

  API.registerHandler({
    emitter: 'plugin',
    plugin: '*',
    event: 'logout'
  }, function() {
    clearInterval(interval);
  });
};
