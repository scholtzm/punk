const request = require('request');
const NotificationActions = require('../../actions/notification-actions.js');

/**
 * Notifications
 * Handles Steam's notifications.
 * TODO switch completely to Steam messages?
 */
exports.name = 'punk-notifications';

exports.plugin = function(API) {
  const TIMEOUT = 20000;
  const STEAMCOMMUNITY = 'https://steamcommunity.com';
  const NOTIFICATIONS_URL = `${STEAMCOMMUNITY }/actions/GetNotificationCounts`;

  const log = API.getLogger();
  const jar = request.jar();
  const req = request.defaults({ jar });

  let interval;

  function getNotifications() {
    const options = {
      uri: NOTIFICATIONS_URL,
      json: true
    };

    req.get(options, (error, response, body) => {
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

      const notifications = {
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
  }, (cookies) => {
    cookies.forEach((cookie) => {
      jar.setCookie(request.cookie(cookie), STEAMCOMMUNITY);
    });

    clearInterval(interval);
    getNotifications();
    interval = setInterval(getNotifications, TIMEOUT);
  });

  API.registerHandler({
    emitter: 'steamUser',
    event: 'tradeOffers'
  }, (count) => {
    log.debug('Pending trade offer count: %d.', count);
    NotificationActions.updateTradeOfferCount(count);
  });

  API.registerHandler({
    emitter: 'plugin',
    plugin: '*',
    event: 'logout'
  }, () => {
    clearInterval(interval);
  });
};
