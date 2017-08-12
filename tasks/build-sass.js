const gulp = require('gulp');
const sass = require('gulp-sass');

const config = require('./config');

module.exports = function buildCss() {
  return gulp.src(config.sassPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.outputCssPath));
};
