/**
 * Central storage with in-memory cache
 */
var fs = require('fs');
var path = require('path');

var _dir = 'data';
var _storage = {};

if (!fs.existsSync(path.join('.', _dir))){
  fs.mkdirSync(path.join('.', _dir));
}

var Storage = {};

Storage.set = function(key, value, callback) {
  _storage[key] = value;

  var filePath = path.join('.', _dir, key);

  fs.writeFile(filePath, value, callback);
};

Storage.get = function(key, callback) {
  if(key in _storage) {
    callback(null, _storage[key]);
    return;
  }

  var filePath = path.join('.', _dir, key);

  fs.readFile(filePath, callback);
};

module.exports = Storage;
