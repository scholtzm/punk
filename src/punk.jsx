var fs = require('fs');
var React = require('react');
var ReactDOM = require('react-dom');
var vapor = require('vapor');

var Loader = require('./components/loader.js');
var Login = require('./components/login.js');
var Main = require('./components/main.js');

var steamGuard = require('./plugins/steamguard');
var logOnResponse = require('./plugins/logonresponse');
var personaState = require('./plugins/personastate');
var friendMsg = require('./plugins/friendmsg');

function Punk() {
  this.userConfig = './user.json';

  this.client = vapor();

  this.friends = {};
  this.chats = {};
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
  this.client.use(logOnResponse);
  this.client.use(personaState);
  this.client.use(friendMsg);
};

Punk.prototype.connect = function() {
  this.client.connect();
};

Punk.prototype.render = function() {
  var self = this;
  ReactDOM.render(<Main friends={self.friends} chats={self.chats}/>, document.getElementById('app'));
};

module.exports = Punk;
