const Storage = require('../../utils/storage.js');
const Logger = require('../../utils/logger.js')('plugin:loginkey');

/**
 * Login Key plugin
 * Saves user's credentials after we successfully log in.
 */
module.exports = function loginKeyPlugin(steamUser) {
  steamUser.on('loginKey', (loginKey) => {
     // FIXME: Do not access private properties
    const accountName = steamUser._logOnDetails.account_name;

    const user = {
      accountName,
      loginKey
    };

    const userString = JSON.stringify(user, null, 2);

    Logger.debug('Received new login key.');

    Storage.set({ fileName: 'user.json', value: userString }, (error) => {
      if (error) {
        Logger.warn('Failed to save user data.');
        Logger.debug(error);
      }
    });

  });
};
