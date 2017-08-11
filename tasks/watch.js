const { watch } = require('gulp');

const buildJs = require('./build-js');
const buildSass = require('./build-sass');
const config = require('./config');

module.exports = function watchTask() {
  watch(config.jsPath, buildJs);
  watch(config.sassPath, buildSass);
};
