const Storage = require('../../utils/storage.js');

/**
 * File plugin
 * Proxies all file events from SteamUser to our Storage module.
 * FIXME: Do not access private properties
 */
module.exports = function filePlugin(steamUser) {
  steamUser.storage.on('read', (fileName, callback) => {
    const accountName = steamUser._logOnDetails.account_name;
    Storage.get({ prefix: accountName.toLowerCase(), fileName }, callback);
  });

  steamUser.storage.on('save', (fileName, value, callback) => {
    const accountName = steamUser._logOnDetails.account_name;
    Storage.set({ prefix: accountName.toLowerCase(), fileName, value }, callback);
  });
};
