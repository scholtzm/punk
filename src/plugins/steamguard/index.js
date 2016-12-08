var React = require('react');
var ReactDOM = require('react-dom');

var Component = require('./component.js');

/**
 * SteamGuard
 * Handles Vapor's SteamGuard event: e-mail and mobile
 * This plugin supplies its own React component
 */
exports.name = 'punk-steamguard';

exports.plugin = function(API) {
  API.registerHandler({
    emitter: 'vapor',
    event: 'steamGuard'
  }, function(callback) {
    ReactDOM.render(<Component callback={callback} />, document.getElementById('app'));
  });
};
