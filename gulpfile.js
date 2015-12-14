var gulp = require('gulp');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var rimraf = require('gulp-rimraf');

var jsPath = ['src/**/*.js', 'src/**/*.jsx'];
var sassPath = 'css/**/*.scss';
var fontPath = 'css/fonts/*.*';

gulp.task('default', ['clean'], function() {
  gulp.start('transpile-js', 'transpile-sass', 'copy-fonts');
});

gulp.task('watch', function () {
  gulp.watch(jsPath, ['transpile-js']);
  gulp.watch(sassPath, ['transpile-sass']);
});

gulp.task('clean', function () {
  return gulp.src(['dist/css', 'dist/js'], { read: false })
    .pipe(rimraf());
});

gulp.task('transpile-js', function() {
  return gulp.src(jsPath)
    .pipe(babel())
    .on('error', function(error) {
      console.log(error.stack);
      this.emit('end');
    })
    .pipe(gulp.dest('dist/js'));
});

gulp.task('transpile-sass', function () {
  gulp.src(sassPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('copy-fonts', function() {
  gulp.src(fontPath)
    .pipe(gulp.dest('dist/css/fonts'));
});
