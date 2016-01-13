var React = require('react');
var ReactDOM = require('react-dom');

var Loader = require('../../components/loader.js');

var UIActions = require('../../actions/ui-actions.js');

/**
 * Disconnected
 * Automatically reconnects Vapor client after we get disconnected.
 */
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
    var enumString = utils.enumToString(error.eresult, Steam.EResult);
    log.warn('Got disconnected. EResult: %d (%s)', error.eresult, enumString);

    if(error.eresult === Steam.EResult.InvalidPassword && !logOnDetailsAreCorrect) {
      var message = 'Login error: ' + enumString;
      UIActions.logout(message);
    } else {
      setTimeout(function() { API.connect(); }, 3000);

      ReactDOM.render(<Loader message="Got disconnected. Connecting back..." />, document.getElementById('app'));
    }
  });
};
