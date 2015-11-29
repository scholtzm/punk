var fs = require('fs');
var React = require('react');
var ReactDOM = require('react-dom');
var vapor = require('vapor');

var Loader = require('./components/loader.js');
var Login = require('./components/login.js');

var steamGuard = require('./plugins/steamguard');
var logOnResponse = require('./plugins/logonresponse');

function Punk() {
  this.configFile = './config.json';

  this.client = vapor();
}

Punk.prototype.start = function() {
  var config;
  try {
    config = JSON.parse(fs.readFileSync(this.configFile));
  } catch (error) {
    console.log(error);
    // doesn't exist or unparsable
  }

  if (config && config.username && config.password) {
    ReactDOM.render(<Loader />, document.getElementById('main'));

    this.init(config.username, config.password);
    this.loadPlugins();
    this.connect();
  } else {
    ReactDOM.render(<Login />, document.getElementById('main'));
  }
};

Punk.prototype.init = function(username, password) {
  this.client.init({
    username: username,
    password: password
  });
};

Punk.prototype.loadPlugins = function() {
  this.client.use(vapor.plugins.consoleLogger);
  this.client.use(vapor.plugins.fs);

  this.client.use(steamGuard);
  this.client.use(logOnResponse);
};

Punk.prototype.connect = function() {
  this.client.connect();
};

module.exports = Punk;
