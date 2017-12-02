const React = require('react');
const ReactDOM = require('react-dom');

const Loader = require('../../components/misc/Loader.js');

const UIActions = require('../../actions/ui-actions.js');

/**
 * Disconnected
 * Automatically reconnects Vapor client after we get disconnected.
 */
exports.name = 'punk-disconnected';

exports.plugin = function(API) {
  const log = API.getLogger();
  const Steam = API.getSteam();
  const utils = API.getUtils();

  let tryCount = 0;

  API.registerHandler({
    emitter: 'client',
    event: 'logOnResponse'
  }, (response) => {
    if(response.eresult === Steam.EResult.OK) {
      tryCount = 0;
    }
  });

  API.registerHandler({
    emitter: 'vapor',
    event: 'disconnected'
  }, (error) => {
    const enumString = utils.enumToString(error.eresult, Steam.EResult);
    log.warn('Got disconnected. EResult: %d (%s)', error.eresult, enumString);

    if(error.eresult === Steam.EResult.InvalidPassword ||
      error.eresult === Steam.EResult.InvalidLoginAuthCode) {
      const message = `Login error: ${ enumString}`;
      UIActions.logout(message);
    } else {
      setTimeout(() => {
        API.connect(); 
      }, 3000);

      const message = `Got disconnected: ${ error.eresult } (${ enumString }). Retrying... (${ ++tryCount })`;
      ReactDOM.render(<Loader message={message} />, document.getElementById('app'));
    }
  });
};
