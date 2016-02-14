var util = require('util');
var moment = require('moment');
var path = require('path');

var Dispatcher = require('../../dispatcher');
var Constants = require('../../constants');
var Constants = require('../../constants');
var Storage = require('../../utils/storage.js');

/**
 * Chat Logger
 * Automatically logs all chat messages to file.
 * In the future, users should be able to disable plugins like this one.
 */
exports.name = 'punk-chat-logger';

exports.plugin = function(API) {
  var client = API.getClient();
  var steamFriends = API.getHandler('steamFriends');
  var log = API.getLogger();
  var username = API.getConfig().username;

  function getKey(id) {
    return id + '.log';
  }

  function formatMessage(id, message) {
    var displayName = id || '<unknown>';

    var persona = steamFriends.personaStates[id];
    if(persona) {
      displayName = persona.player_name;
    }

    var timestamp = new Date();

    return util.format('[%s] %s: %s\n', moment(timestamp).format('YYYY-MM-DD HH:mm:ss'), displayName, message);
  }

  function createOptions(id, sender, text) {
    return {
      prefix: path.join(username, 'logs'),
      fileName: getKey(id),
      value: formatMessage(sender, text)
    };
  }

  function appendCallback(error) {
    if(error) {
      log.error('Failed to save chat message.');
      log.error(error);
    }
  }

  var token = Dispatcher.register(function(action) {
    switch(action.type) {
      case Constants.ChatActions.CHAT_NEW_OUTGOING_MESSAGE:
        Storage.append(createOptions(action.message.target, client.steamID, action.message.text), appendCallback);
        break;

      case Constants.ChatActions.CHAT_NEW_INCOMING_MESSAGE:
        Storage.append(createOptions(action.message.sender, action.message.sender, action.message.text), appendCallback);
        break;

      case Constants.ChatActions.CHAT_ECHO_MESSAGE:
        Storage.append(createOptions(action.message.target, client.steamID, action.message.text), appendCallback);
        break;

      default:
        // ignore
    }
  });

  API.registerHandler({
    emitter: 'plugin',
    plugin: '*',
    event: 'logout'
  }, function() {
    Dispatcher.unregister(token);
  });
};
