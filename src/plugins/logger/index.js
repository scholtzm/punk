exports.name = 'punk-logger';

exports.plugin = function(VaporAPI) {
  VaporAPI.registerHandler({
    emitter: '*',
    event: 'message:debug'
  }, function(message) {
    console.debug(message);
  });

  VaporAPI.registerHandler({
    emitter: '*',
    event: 'message:info'
  }, function(message) {
    console.info(message);
  });

  VaporAPI.registerHandler({
    emitter: '*',
    event: 'message:warn'
  }, function(message) {
    console.warn(message);
  });

  VaporAPI.registerHandler({
    emitter: '*',
    event: 'message:error'
  }, function(message) {
    console.error(message);
  });
};
