const React = require('react');
const ReactDOM = require('react-dom');

const Component = require('./component.js');
const Logger = require('../../utils/logger.js')('plugin:steamguard');

/**
 * SteamGuard
 * Handles SteamGuard event: e-mail and mobile
 * This plugin supplies its own React component
 */
module.exports = function steamGuardPlugin(steamUser) {
  steamUser.on('steamGuard', (domain, callback) => {
    Logger.info('Received SteamGuard request');
    ReactDOM.render(<Component callback={callback} />, document.getElementById('app'));
  });
};
