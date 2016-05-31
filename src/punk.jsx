var app = require('electron').remote.app;

var React = require('react');
var ReactDOM = require('react-dom');
var vapor = require('vapor');

var Loader = require('./components/loader.js');
var Login = require('./components/login.js');

var Storage = require('./utils/storage.js');
var Logger = require('./utils/logger.js')('punk');
var plugins = require('./plugins');

function Punk() {
  this.client = vapor();
}

Punk.prototype.start = function() {
  var self = this;

  Logger.info('Starting %s v%s', app.getName(), app.getVersion());

  Storage.get({fileName: 'user.json'}, function(error, data) {
    if(error) {
      // assume the file does not exist
      ReactDOM.render(<Login />, document.getElementById('app'));
    } else {
      try {
        var user = JSON.parse(data);
      } catch(e) {
        // ignore the data
        ReactDOM.render(<Login />, document.getElementById('app'));
        return;
      }

      // explicitly set this option
      user.rememberPassword = true;

      ReactDOM.render(<Loader message="Connecting..."/>, document.getElementById('app'));

      self.init(user, function() {
        self.loadPlugins();
        self.connect();
      });
    }
  });
};

Punk.prototype.init = function(options, next) {
  var self = this;
  var sanitizedUsername = options.username.toLowerCase();

  // set logonID to something unique
  // official client obfuscates private IP address but we probably don't want this
  options.logonID = Math.floor(new Date() / 1000);

  Storage.get({prefix: sanitizedUsername, fileName: 'servers.json'}, function(error, data) {
    if(error) {
      Logger.warn('Failed to load server list from cache. Falling back to built-in cache...');
    } else {
      var servers;
      try {
        servers = JSON.parse(data);
      } catch(e) {
        // ignore
      }

      if(servers) {
        self.client.servers = servers;
      }
    }

    self.client.init(options);

    if(typeof next === 'function') {
      next();
    }
  });
};

Punk.prototype.loadPlugins = function() {
  // load these 3 plugins ASAP (order matters)
  this.client.use(plugins.logger);
  this.client.use(plugins.essentials);
  this.client.use(plugins.file);

  this.client.use(plugins.chatLogger);
  this.client.use(plugins.steamGuard);
  this.client.use(plugins.ready);
  this.client.use(plugins.personaState);
  this.client.use(plugins.friendMsg);
  this.client.use(plugins.loginKey);
  this.client.use(plugins.logout);
  this.client.use(plugins.presence);
  this.client.use(plugins.friends);
  this.client.use(plugins.notifications);
  this.client.use(plugins.webSession);
  this.client.use(plugins.disconnected);
  this.client.use(plugins.offlineMessages);
  this.client.use(plugins.trade);
};

Punk.prototype.connect = function() {
  this.client.connect();
};

module.exports = Punk;
