const SteamUser = require('steam-user');
const Logger = require('../../utils/logger.js')('plugin:message-dumper');

/**
 * Message Dumper
 * Helps with debugging by logging every single Steam message.
 */
module.exports = function messageDumperPlugin(steamUser) {
  const ignored = {};
  ignored[SteamUser.EMsg.Multi] = true;

  steamUser.client.on('message', header => {
    if(ignored[header.msg]) {
      return;
    }

    Logger.debug('Received message %d (%s).', header.msg, SteamUser.EMsg[header.msg]);
  });
};
