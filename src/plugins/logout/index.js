const React = require('react');
const ReactDOM = require('react-dom');

const Login = require('../../components/login/Login.js');

const Dispatcher = require('../../dispatcher');
const Constants = require('../../constants');
const Storage = require('../../utils/storage.js');
const Logger = require('../../utils/logger.js')('plugin:logout');

const pluginEmitter = require('../plugin-emitter');

/**
 * Logout plugin
 * Handles logout action invoked from the UI.
 */
module.exports = function logoutPlugin(steamUser) {
  const token = Dispatcher.register((action) => {
    switch (action.type) {
      case Constants.UIActions.UI_LOGOUT:
        Dispatcher.unregister(token);

        Storage.delete({ fileName: 'user.json' }, (error) => {
          if (error && error.code !== 'ENOENT') {
            Logger.error(error);
          }
        });

        steamUser.logOff(true);
        pluginEmitter.emit('logout');

        ReactDOM.render(<Login message={action.message} />, document.getElementById('app'));
        break;

      default:
        // ignore
    }
  });
};
