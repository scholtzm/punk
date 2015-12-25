var React = require('react');
var ReactDOM = require('react-dom');

var Login = require('../../components/login.js');
var Loader = require('../../components/loader.js');

exports.name = 'punk-disconnected';

exports.plugin = function(API) {
  var log = API.getLogger();
  var Steam = API.getSteam();
  var utils = API.getUtils();

  var logOnDetailsAreCorrect = false;

  API.registerHandler({
    emitter: 'client',
    event: 'logOnResponse'
  }, function(response) {
    if(response.eresult === Steam.EResult.OK) {
      logOnDetailsAreCorrect = true;
    }
  });

  API.registerHandler({
    emitter: 'vapor',
    event: 'disconnected'
  }, function(error) {
    log.warn('Got disconnected. EResult: %d', error.eresult);
    if(error.eresult === Steam.EResult.InvalidPassword && !logOnDetailsAreCorrect) {
      var enumString = utils.enumToString(error.eresult, Steam.EResult);
      var message = 'Login error: ' + enumString;

      // need to emit this for other plugins to unregister their dispatcher callbacks
      API.emitEvent('shutdown');
      ReactDOM.render(<Login message={message} />, document.getElementById('app'));
    } else {
      setTimeout(function() {
        API.connect();
      }, 3000);
      ReactDOM.render(<Loader message="Got disconnected. Connecting back..." />, document.getElementById('app'));
    }
  });
};
