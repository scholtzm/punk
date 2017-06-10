const React = require('react');
const ReactDOM = require('react-dom');

const Main = require('../../components/main/Main.js');

/**
 * Ready
 * Handles Vapor's ready event (which is just a shorthand event for successful logon)
 */
exports.name = 'punk-ready';

exports.plugin = function(API) {
  const Steam = API.getSteam();

  API.registerHandler({
    emitter: 'client',
    event: 'logOnResponse'
  }, (response) => {
    if(response.eresult === Steam.EResult.OK) {
      ReactDOM.render(<Main />, document.getElementById('app'));
    }
  });
};
