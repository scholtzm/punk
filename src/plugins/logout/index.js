const React = require('react');
const ReactDOM = require('react-dom');

const Login = require('../../components/login/Login.js');

const Dispatcher = require('../../dispatcher');
const Constants = require('../../constants');
const Storage = require('../../utils/storage.js');

/**
 * Logout
 * Handles logout action invoked from the UI.
 */
exports.name = 'punk-logout';

exports.plugin = function(API) {
  const log = API.getLogger();

  const token = Dispatcher.register((action) => {
    switch(action.type) {
      case Constants.UIActions.UI_LOGOUT:
        Dispatcher.unregister(token);

        Storage.delete({ fileName: 'user.json' }, (error) => {
          if(error && error.code !== 'ENOENT') {
            log.error(error);
          }
        });

        API.emitEvent('logout');
        API.disconnect();

        ReactDOM.render(<Login message={action.message} />, document.getElementById('app'));
        break;

      default:
        // ignore
    }
  });
};
