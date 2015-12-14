var React = require('react');
var ReactDOM = require('react-dom');

var Login = require('../../components/login.js');

var Dispatcher = require('../../dispatcher');
var Constants = require('../../constants');

exports.name = 'punk-logout';

exports.plugin = function(API) {
  var token = Dispatcher.register(function(action) {
    switch(action.type) {
      case Constants.UIActions.LOGOUT:
        Dispatcher.unregister(token);

        API.emitEvent('logout');
        API.disconnect();

        ReactDOM.render(<Login />, document.getElementById('app'));
        break;

      default:
        // ignore
    }
  });
};
