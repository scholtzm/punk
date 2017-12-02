const SteamUser = require('steam-user');
const React = require('react');
const ReactDOM = require('react-dom');

const Logger = require('../../utils/logger.js')('plugin:error');
const Loader = require('../../components/misc/Loader.js');
const UIActions = require('../../actions/ui-actions.js');

const Main = require('../../components/main/Main.js');

/**
 * Disconnected Plugin
 * Automatically reconnects client after we get disconnected.
 */
module.exports = function errorPlugin(steamUser) {
  let tryCount = 0;

  steamUser.on('loggedOn', (response) => {
    if (response.eresult === SteamUser.EResult.OK) {
      tryCount = 0;
      ReactDOM.render(<Main />, document.getElementById('app'));
    }
  });

  steamUser.on('disconnected', (eresult) => {
    const enumString = SteamUser.EResult[eresult];
    const message = `Got disconnected: ${eresult} (${enumString}). Retrying... (${++tryCount})`;

    ReactDOM.render(<Loader message={message} />, document.getElementById('app'));
  });

  steamUser.on('error', (error) => {
    const enumString = SteamUser.EResult[error.eresult];

    Logger.warn('Got disconnected. EResult: %d (%s)', error.eresult, enumString);
    UIActions.logout(`Login error: ${enumString}`);
  });
};
