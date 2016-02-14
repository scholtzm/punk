var React = require('react');
var ReactDOM = require('react-dom');

var Login = require('../../components/login.js');

var Dispatcher = require('../../dispatcher');
var Constants = require('../../constants');
var Storage = require('../../utils/storage.js');

/**
 * Logout
 * Handles logout action invoked from the UI.
 */
exports.name = 'punk-logout';

exports.plugin = function(API) {
  var log = API.getLogger();

  var token = Dispatcher.register(function(action) {
    switch(action.type) {
      case Constants.UIActions.UI_LOGOUT:
        Dispatcher.unregister(token);

        Storage.delete('user.json', function(error) {
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
