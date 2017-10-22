/**
 * Central storage with in-memory cache
 */
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const app = process.type === 'renderer'
  ? require('electron').remote.app
  : require('electron').app;

const _defaultDir = path.join(app.getPath('userData'), 'data');

function getPath(options) {
  const prefix = options.prefix || '';
  return path.join(_defaultDir, prefix, options.fileName);
}

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)){
    mkdirp.sync(dir);
  }
}

function ensurePrefixExists(prefix) {
  ensureDirectoryExists(path.join(_defaultDir, prefix));
}

ensureDirectoryExists(_defaultDir);

const Storage = {};

Storage.set = function(options, callback) {
  if(options.prefix) {
    ensurePrefixExists(options.prefix);
  }
  const file = getPath(options);

  fs.writeFile(file, options.value, callback);
};

Storage.get = function(options, callback) {
  const file = getPath(options);
  fs.readFile(file, callback);
};

Storage.append = function(options, callback) {
  if(options.prefix) {
    ensurePrefixExists(options.prefix);
  }
  const file = getPath(options);

  fs.appendFile(file, options.value, callback);
};

Storage.delete = function(options, callback) {
  const file = getPath(options);
  fs.unlink(file, callback);
};

module.exports = Storage;
