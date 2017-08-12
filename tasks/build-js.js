const gulp = require('gulp');
const babel = require('gulp-babel');

const config = require('./config');

module.exports = function buildJs() {
  return gulp.src(config.jsPath)
    .pipe(babel())
    .on('error', function(error) {
      console.log(error.stack);
      this.emit('end');
    })
    .pipe(gulp.dest(config.outputJsPath));
};
