var React = require('react');
var ReactDOM = require('react-dom');

var Main = require('../../components/main.js');

exports.name = 'punk-ready';

exports.plugin = function(API) {
  var Steam = API.getSteam();

  API.registerHandler({
    emitter: 'client',
    event: 'logOnResponse'
  }, function(response) {
    if(response.eresult === Steam.EResult.OK) {
      ReactDOM.render(<Main />, document.getElementById('app'));
    }
  });
};
