const React = require('react');
const ReactDOM = require('react-dom');

const Component = require('./component.js');

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
  }, (callback) => {
    ReactDOM.render(<Component callback={callback} />, document.getElementById('app'));
  });
};
