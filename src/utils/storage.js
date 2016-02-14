/**
 * Central storage with in-memory cache
 */
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var app = process.type === 'renderer'
  ? require('remote').app
  : require('app');

var _defaultDir = path.join(app.getPath('userData'), 'data');
var _storage = {};

function getPath(key) {
  return path.join(_defaultDir, key);
}

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)){
    mkdirp.sync(dir);
  }
}

ensureDirectoryExists(_defaultDir);

var Storage = {};

Storage.set = function(key, value, callback) {
  _storage[key] = value;
  fs.writeFile(getPath(key), value, callback);
};

Storage.get = function(key, callback) {
  if(key in _storage) {
    callback(null, _storage[key]);
    return;
  }

  fs.readFile(getPath(key), callback);
};

Storage.append = function(key, value, callback) {
  if(!(key in _storage)) {
    _storage[key] = [];
  }

  _storage[key].push(value);
  fs.appendFile(getPath(key), value, callback);
};

Storage.delete = function(key, callback) {
  delete _storage[key];
  fs.unlink(getPath(key), callback);
};

module.exports = Storage;
