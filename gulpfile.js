const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const rimraf = require('gulp-rimraf');

const jsPath = ['src/**/*.js', 'src/**/*.jsx'];
const sassPath = 'style/**/*.scss';
const fontPath = 'style/fonts/*.*';

gulp.task('default', ['clean'], () => {
  gulp.start('transpile-js', 'transpile-sass', 'copy-fonts');
});

gulp.task('watch', ['default'], () => {
  gulp.watch(jsPath, ['transpile-js']);
  gulp.watch(sassPath, ['transpile-sass']);
});

gulp.task('clean', () => {
  return gulp.src(['dist/css', 'dist/js'], { read: false })
    .pipe(rimraf());
});

gulp.task('transpile-js', () => {
  return gulp.src(jsPath)
    .pipe(babel())
    .on('error', function(error) {
      console.log(error.stack);
      this.emit('end');
    })
    .pipe(gulp.dest('dist/js'));
});

gulp.task('transpile-sass', () => {
  gulp.src(sassPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('copy-fonts', () => {
  gulp.src(fontPath)
    .pipe(gulp.dest('dist/css/fonts'));
});
