/**
 * Application logger which logs to console as well as file.
 */
var util = require('util');
var moment = require('moment');
var Storage = require('./storage.js');

function log(args, logFunc, level) {
  var date = new Date();
  var message = util.format.apply(util, args);
  var logMessage = util.format('[%s @ %s] %s\n', level, moment(date).format('YYYY-MM-DD HH:mm:ss'), message);

  logFunc(message);
  Storage.append('punk.log', logMessage, function(error) {
    if(error) {
      console.error('Failed to save log message.');
      console.error(error);
    }
  });
}

var Logger = {};

Logger.debug = function(/* arguments */) {
  log(arguments, console.debug.bind(console), 'DEBUG');
};

Logger.info = function(/* arguments */) {
  log(arguments, console.info.bind(console), 'INFO');
};

Logger.warn = function(/* arguments */) {
  log(arguments, console.warn.bind(console), 'WARN');
};

Logger.error = function(/* arguments */) {
  log(arguments, console.error.bind(console), 'ERROR');
};

module.exports = Logger;
