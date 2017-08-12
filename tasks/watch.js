const gulp = require('gulp');

const buildJs = require('./build-js');
const buildSass = require('./build-sass');
const config = require('./config');

module.exports = function watchTask() {
  gulp.watch(config.jsPath, buildJs);
  gulp.watch(config.sassPath, buildSass);
};
