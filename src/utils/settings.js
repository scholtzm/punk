/**
 * App settings
 */
const Storage = require('./storage.js');

const _fileName = 'settings.json';
const _settingsCache = {};

const Settings = {};

Settings.set = function(key, value, callback) {
  _settingsCache[key] = value;

  Storage.get({ fileName: _fileName }, (err, data) => {
    let parsedData = {};
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
    Storage.set({ fileName: _fileName, value: JSON.stringify(parsedData, null, 2) }, (setError) => {
      callback(setError);
    });
  });
};

Settings.get = function(key, callback) {
  if(key in _settingsCache) {
    callback(null, _settingsCache[key]);
    return;
  }

  Storage.get({ fileName: _fileName }, (err, data) => {
    if(err) {
      callback(err);
    } else {
      try {
        const parsedData = JSON.parse(data);
        callback(null, parsedData[key]);
      } catch(e) {
        callback(e);
      }
    }
  });
};

module.exports = Settings;
