const gulp = require('gulp');
const babel = require('gulp-babel');

const config = require('./config');

module.exports = function buildJs() {
  return gulp.src(config.jsPath)
    .pipe(babel({
      presets: ['react']
    }))
    .on('error', (error) => {
      console.log(error.stack);
      this.emit('end');
    })
    .pipe(gulp.dest(config.outputJsPath));
};
