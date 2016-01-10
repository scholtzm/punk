exports.name = 'punk-logger';

exports.plugin = function(API) {
  API.registerHandler({
    emitter: '*',
    event: 'message:debug'
  }, function(message) {
    console.debug(message);
  });

  API.registerHandler({
    emitter: '*',
    event: 'message:info'
  }, function(message) {
    console.info(message);
  });

  API.registerHandler({
    emitter: '*',
    event: 'message:warn'
  }, function(message) {
    console.warn(message);
  });

  API.registerHandler({
    emitter: '*',
    event: 'message:error'
  }, function(message) {
    console.error(message);
  });
};
