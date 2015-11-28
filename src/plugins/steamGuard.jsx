var React = require('react');
var ReactDOM = require('react-dom');

var SteamGuard = require('../components/steamguard.js');

exports.name = 'punk-steamguard';

exports.plugin = function(API) {
  API.registerHandler({
    emitter: 'vapor',
    event: 'steamGuard'
  }, function(callback) {
    ReactDOM.render(<SteamGuard callback={callback} />, document.getElementById('main'));
  });
};
