/**
 * Application logger which logs to console as well as file.
 */
const os = require('os');
const util = require('util');
const moment = require('moment');
const Storage = require('./storage.js');

function log(args, logFunc, level, tag) {
  const date = new Date();
  const eol = os.EOL;
  const message = util.format.apply(util, args);
  const logMessage = util.format('[%s @ %s] [%s] %s%s', level, moment(date).format('YYYY-MM-DD HH:mm:ss'), tag, message, eol);

  logFunc(logMessage);
  Storage.append({ fileName: 'punk.log', value: logMessage }, (error) => {
    if(error) {
      console.error('Failed to save log message.');
      console.error(error);
    }
  });
}

function Logger(tag) {
  this.tag = tag;
};

Logger.prototype.debug = function(/* arguments */) {
  log(arguments, console.debug.bind(console), 'DEBUG', this.tag);
};

Logger.prototype.info = function(/* arguments */) {
  log(arguments, console.info.bind(console), 'INFO', this.tag);
};

Logger.prototype.warn = function(/* arguments */) {
  log(arguments, console.warn.bind(console), 'WARN', this.tag);
};

Logger.prototype.error = function(/* arguments */) {
  log(arguments, console.error.bind(console), 'ERROR', this.tag);
};

function loggerFactory(tag) {
  return new Logger(tag);
}

module.exports = loggerFactory;
