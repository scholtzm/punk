const semver = require('semver');
const request = require('request');

// TODO: Fix paths.
const pkg = require('../../../package.json'); // eslint-disable-line import/no-unresolved
const UIActions = require('../actions/ui-actions.js');
const Logger = require('./logger.js')('updater');

module.exports = function() {
  Logger.debug('Checking for updates');

  const options = {
    uri: pkg.repository.updateUrl,
    json: true,
    headers: {
      'User-Agent': `punk-${pkg.version}`
    }
  };

  request.get(options, (error, response, body) => {
    if(error) {
      Logger.error('Update checker failed', error);
      return;
    }

    if(body.length === 0) {
      return;
    }

    const latestVersion = semver.clean(body[0].tag_name);

    Logger.debug('Latest available version', latestVersion);

    if(semver.lt(pkg.version, latestVersion)) {
      Logger.debug('Current version is lower than latest version');
      UIActions.notifyUpdateAvailable();
    }
  });
};
