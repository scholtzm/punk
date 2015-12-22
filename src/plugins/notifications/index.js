var request = require('request');

var NotificationActions = require('../../actions/notification-actions.js');

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
      // if cookies are dead, error will be null and body will be null as well
      if(body === null) {
        clearInterval(interval);
        // Vapor will keep repeating until successful
        API.webLogOn();
        return;
      }

      var notifications = {
        // TODO: need to figure out the rest, especially pending items
        tradeOffers: body.notifications[1],
        unreadComments: body.notifications[4],
        unreadMessages: body.notifications[9]
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
};
