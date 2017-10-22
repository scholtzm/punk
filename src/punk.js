const app = require('electron').remote.app;

const React = require('react');
const ReactDOM = require('react-dom');
const vapor = require('vapor');

const Loader = require('./components/misc/Loader.js');
const Login = require('./components/login/Login.js');

const updateChecker = require('./utils/update-checker.js');
const Storage = require('./utils/storage.js');
const Logger = require('./utils/logger.js')('punk');
const plugins = require('./plugins');

function Punk() {
  this.client = vapor();
}

Punk.prototype.start = function() {
  const self = this;

  Logger.info('Starting %s v%s', app.getName(), app.getVersion());

  updateChecker();

  Storage.get({ fileName: 'user.json' }, (error, data) => {
    if(error) {
      // assume the file does not exist
      ReactDOM.render(<Login />, document.getElementById('app'));
    } else {
      let user;
      try {
        user = JSON.parse(data);
      } catch(e) {
        // ignore the data
        ReactDOM.render(<Login />, document.getElementById('app'));
        return;
      }

      // future compatibility
      user.username = user.username || user.accountName;

      // explicitly set this option
      user.rememberPassword = true;

      ReactDOM.render(<Loader message="Connecting..."/>, document.getElementById('app'));

      self.init(user, () => {
        self.loadPlugins();
        self.connect();
      });
    }
  });
};

Punk.prototype.init = function(options, next) {
  const self = this;
  const sanitizedUsername = options.username.toLowerCase();

  // set logonID to something unique
  // official client obfuscates private IP address but we probably don't want this
  options.logonID = Math.floor(new Date() / 1000);

  Storage.get({ prefix: sanitizedUsername, fileName: 'servers.json' }, (error, data) => {
    if(error) {
      Logger.warn('Failed to load server list from cache. Falling back to built-in cache...');
    } else {
      let servers;
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
