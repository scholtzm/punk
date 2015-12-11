var React = require('react');
var ReactDOM = require('react-dom');

var Main = require('../../components/main.js');

exports.name = 'punk-ready';

exports.plugin = function(API) {
  API.registerHandler({
    emitter: 'vapor',
    event: 'ready'
  }, function() {
    ReactDOM.render(<Main />, document.getElementById('app'));
  });
};
