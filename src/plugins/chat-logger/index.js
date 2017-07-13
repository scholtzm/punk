const util = require('util');
const moment = require('moment');
const path = require('path');

const Dispatcher = require('../../dispatcher');
const Constants = require('../../constants');
const Storage = require('../../utils/storage.js');

/**
 * Chat Logger
 * Automatically logs all chat messages to file.
 * In the future, users should be able to disable plugins like this one.
 */
const os = require('os');

exports.name = 'punk-chat-logger';

exports.plugin = function(API) {
  const client = API.getClient();
  const steamFriends = API.getHandler('steamFriends');
  const log = API.getLogger();
  const username = API.getConfig().username;
  const sanitizedUsername = username.toLowerCase();

  function getKey(id) {
    return `${id }.log`;
  }

  function formatMessage(id, message) {
    let displayName = id || '<unknown>';

    const persona = steamFriends.personaStates[id];
    if(persona) {
      displayName = persona.player_name;
    }

    const timestamp = new Date();
    const eol = os.EOL;

    return util.format('[%s] %s: %s%s', moment(timestamp).format('YYYY-MM-DD HH:mm:ss'), displayName, message, eol);
  }

  function createOptions(id, sender, text) {
    return {
      prefix: path.join(sanitizedUsername, 'logs'),
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

  const token = Dispatcher.register((action) => {
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
  }, () => {
    Dispatcher.unregister(token);
  });
};
