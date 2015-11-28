var React = require('react');
var ReactDOM = require('react-dom');
var vapor = require('vapor');

var Login = require('./components/login.js');

var steamGuard = require('./plugins/steamGuard.js');

function Punk() {
  this.client = vapor();
}

Punk.prototype.start = function() {
  ReactDOM.render(<Login />, document.getElementById('main'));
};

Punk.prototype.init = function(username, password) {
  var client = this.client;

  client.init({
    username: username,
    password: password
  });
};

Punk.prototype.loadPlugins = function() {
  this.client.use(vapor.plugins.consoleLogger);
  this.client.use(vapor.plugins.fs);

  this.client.use(steamGuard);
};

Punk.prototype.connect = function() {
  this.client.connect();
};

module.exports = Punk;
