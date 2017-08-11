const { join } = require('path');
const del = require('del');

const config = require('./config');

module.exports = function clean(callback) {
  const toDelete = [
    join(config.outputFolder, '**', '*')
  ];

  del(toDelete)
    .then(() => callback())
    .catch(error => callback(error));
};
