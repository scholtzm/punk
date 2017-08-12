const gulp = require('gulp');

const config = require('./config');

module.exports = function copyFonts() {
  return gulp.src(config.fontPath)
    .pipe(gulp.dest(config.outputFontPath));
};
