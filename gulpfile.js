var gulp = require('gulp');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var rimraf = require('gulp-rimraf');

var jsPath = ['src/**/*.js', 'src/**/*.jsx'];
var sassPath = 'sass/**/*.scss';

gulp.task('default', ['clean'], function() {
  gulp.start('transpile-js', 'transpile-sass');
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
    .pipe(gulp.dest('dist/js'));
});

gulp.task('transpile-sass', function () {
  gulp.src(sassPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});
