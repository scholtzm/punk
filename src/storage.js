/**
 * Central storage with in-memory cache
 */
var fs = require('fs');
var path = require('path');

var _dir = 'data';
var _storage = {};

function getPath(key) {
  return path.join('.', _dir, key);
}

if (!fs.existsSync(path.join('.', _dir))){
  fs.mkdirSync(path.join('.', _dir));
}

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
