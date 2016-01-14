var util = require('util');
var moment = require('moment');

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
    return username + '-' + id + '.txt';
  }

  function formatMessage(id, message) {
    var username = id || '<unknown>';

    var persona = steamFriends.personaStates[id];
    if(persona) {
      username = persona.player_name;
    }

    var timestamp = new Date();

    return util.format('[%s] %s: %s\n', moment(timestamp).format('YYYY-MM-DD HH:mm:ss'), username, message);
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
        Storage.append(getKey(action.message.target), formatMessage(client.steamID, action.message.text), appendCallback);
        break;

      case Constants.ChatActions.CHAT_NEW_INCOMING_MESSAGE:
        Storage.append(getKey(action.message.sender), formatMessage(action.message.sender, action.message.text), appendCallback);
        break;

      case Constants.ChatActions.CHAT_ECHO_MESSAGE:
        Storage.append(getKey(action.message.target), formatMessage(client.steamID, action.message.text), appendCallback);
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
