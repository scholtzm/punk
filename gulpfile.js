const gulp = require('gulp');

const clean = require('./tasks/clean');
const buildJs = require('./tasks/build-js');
const buildSass = require('./tasks/build-sass');
const copyFonts = require('./tasks/copy-fonts');
const watch = require('./tasks/watch');
const package = require('./tasks/package');

const build = gulp.parallel(buildJs, buildSass, copyFonts);

gulp.task('clean', clean);
gulp.task('build', gulp.series(clean, build));
gulp.task('watch', gulp.series(clean, build, watch));
gulp.task('package', package);
