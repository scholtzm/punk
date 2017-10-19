const util = require('util');
const moment = require('moment');
const path = require('path');

const Dispatcher = require('../../dispatcher');
const Constants = require('../../constants');
const Storage = require('../../utils/storage.js');
const Logger = require('../../utils/logger.js')('plugin:chat-logger');

/**
 * Chat Logger
 * Automatically logs all chat messages to file.
 * In the future, users should be able to disable plugins like this one.
 */
const os = require('os');

module.exports = function chatLoggerPlugin(steamUser) {
  function getKey(id) {
    return `${id }.log`;
  }

  function formatMessage(id, message) {
    let displayName = id || '<unknown>';

    const persona = steamUser.users[id];
    if(persona) {
      displayName = persona.player_name;
    }

    const timestamp = new Date();
    const eol = os.EOL;

    return util.format('[%s] %s: %s%s', moment(timestamp).format('YYYY-MM-DD HH:mm:ss'), displayName, message, eol);
  }

  function createOptions(id, sender, text) {
    const accountName = steamUser._logOnDetails.account_name;

    return {
      prefix: path.join(accountName.toLowerCase(), 'logs'),
      fileName: getKey(id),
      value: formatMessage(sender, text)
    };
  }

  function appendCallback(error) {
    if(error) {
      Logger.error('Failed to save chat message.');
      Logger.error(error);
    }
  }

  Dispatcher.register((action) => {
    switch(action.type) {
      case Constants.ChatActions.CHAT_NEW_OUTGOING_MESSAGE:
        Storage.append(createOptions(action.message.target, steamUser.steamID, action.message.text), appendCallback);
        break;

      case Constants.ChatActions.CHAT_NEW_INCOMING_MESSAGE:
        Storage.append(createOptions(action.message.sender, action.message.sender, action.message.text), appendCallback);
        break;

      case Constants.ChatActions.CHAT_ECHO_MESSAGE:
        Storage.append(createOptions(action.message.target, steamUser.steamID, action.message.text), appendCallback);
        break;

      default:
        // ignore
    }
  });
};
