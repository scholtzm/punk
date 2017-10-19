const SteamUser = require('steam-user');
const React = require('react');
const ReactDOM = require('react-dom');

const Main = require('../../components/main/Main.js');

/**
 * Logged On
 * Handles `loggedOn` event
 */
module.exports = function loggedOnPlugin(steamUser) {
  steamUser.on('loggedOn', response => {
    if (response.eresult === SteamUser.EResult.OK) {
      ReactDOM.render(<Main />, document.getElementById('app'));
    }
  });
};
