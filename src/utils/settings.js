/**
 * App settings
 */
var Storage = require('./storage.js');

var _fileName = 'settings.json';
var _settingsCache = {};

var Settings = {};

Settings.set = function(key, value, callback) {
  _settingsCache[key] = value;

  Storage.get(_fileName, function(err, data) {
    var parsedData = {};
    if(err) {
      parsedData[key] = value;
    } else {
      try {
        parsedData = JSON.parse(data);
        parsedData[key] = value;
      } catch(e) {
        parsedData[key] = value;
      }
    }
    Storage.set(_fileName, JSON.stringify(parsedData, null, 2), function(setError) {
      callback(setError);
    });
  });
};

Settings.get = function(key, callback) {
  if(key in _settingsCache) {
    return _settingsCache[key];
  }

  Storage.get(_fileName, function(err, data) {
    if(err) {
      callback(err);
    } else {
      try {
        var parsedData = JSON.parse(data);
        callback(null, parsedData[key]);
      } catch(e) {
        callback(e);
      }
    }
  });
};

module.exports = Settings;
