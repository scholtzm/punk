const app = require('electron').remote.app;

const React = require('react');
const ReactDOM = require('react-dom');
const SteamUser = require('steam-user');

const Loader = require('./components/misc/Loader.js');
const Login = require('./components/login/Login.js');

const updateChecker = require('./utils/update-checker.js');
const Storage = require('./utils/storage.js');
const Logger = require('./utils/logger.js')('punk');
const plugins = require('./plugins');

function Punk() {
  this.client = new SteamUser({ promptSteamGuardCode: false });
  this.loadPlugins();
}

Punk.prototype.start = function() {
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

      // compatibility
      user.accountName = user.accountName || user.username;

      // explicitly set this option
      user.rememberPassword = true;

      // set logonID to something unique
      // official client obfuscates private IP address but we probably don't want this
      user.logonID = Math.floor(new Date() / 1000);

      ReactDOM.render(<Loader message="Logging in..."/>, document.getElementById('app'));

      this.logOn(user);
    }
  });
};

Punk.prototype.logOn = function(details) {
  this.client.logOn(details);
};

Punk.prototype.loadPlugins = function() {
  plugins.chatLogger(this.client);
  plugins.file(this.client);
  plugins.friendMsg(this.client);
  plugins.friends(this.client);
  plugins.loggedOn(this.client);
  plugins.loginKey(this.client);
  plugins.logout(this.client);
  plugins.notifications(this.client);
  plugins.offlineMessages(this.client);
  plugins.presence(this.client);
  plugins.personaState(this.client);
  plugins.steamGuard(this.client);
  plugins.trade(this.client);
  plugins.webSession(this.client);
};

module.exports = Punk;
