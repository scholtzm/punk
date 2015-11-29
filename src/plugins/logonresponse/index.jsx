exports.name = 'punk-logonresponse';

exports.plugin = function(API) {
  var Steam = API.getSteam();

  API.registerHandler({
    emitter: 'client',
    event: 'logOnResponse'
  }, function(response) {
    if(response.eresult === Steam.EResult.OK) {
      punk.render();
    }
  });
};
