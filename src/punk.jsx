var fs = require('fs');
var React = require('react');
var ReactDOM = require('react-dom');
var vapor = require('vapor');

var Loader = require('./components/loader.js');
var Login = require('./components/login.js');

var steamGuard = require('./plugins/steamguard');
var ready = require('./plugins/ready');
var personaState = require('./plugins/personastate');
var friendMsg = require('./plugins/friendmsg');
var logout = require('./plugins/logout');
var presence = require('./plugins/presence');
var friends = require('./plugins/friends');

function Punk() {
  this.userConfig = './user.json';

  this.client = vapor();
}

Punk.prototype.start = function() {
  var config;
  try {
    config = JSON.parse(fs.readFileSync(this.userConfig));
  } catch (error) {
    // doesn't exist or unparsable
  }

  if (config && config.username && config.password) {
    ReactDOM.render(<Loader />, document.getElementById('app'));

    this.init(config.username, config.password);
    this.loadPlugins();
    this.connect();
  } else {
    ReactDOM.render(<Login />, document.getElementById('app'));
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
  this.client.use(vapor.plugins.essentials);

  this.client.use(steamGuard);
  this.client.use(ready);
  this.client.use(personaState);
  this.client.use(friendMsg);
  this.client.use(logout);
  this.client.use(presence);
  this.client.use(friends);
};

Punk.prototype.connect = function() {
  this.client.connect();
};

module.exports = Punk;
