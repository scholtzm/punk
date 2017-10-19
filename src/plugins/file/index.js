const Storage = require('../../utils/storage.js');

/**
 * File plugin
 * Proxies all file events from SteamUser to our Storage module.
 */
module.exports = function filePlugin(steamUser) {
  // FIXME: Do not access private properties
  const accountName = steamUser._logOnDetails.account_name;
  const sanitizedAccountName = accountName.toLowerCase();

  steamUser.storage.on('read', (fileName, callback) => {
    Storage.get({ prefix: sanitizedAccountName, fileName }, callback);
  });

  steamUser.storage.on('save', (fileName, value, callback) => {
    Storage.set({ prefix: sanitizedAccountName, fileName, value }, callback);
  });
};
