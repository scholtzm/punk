const { task, series, parallel } = require('gulp');

const clean = require('./tasks/clean');
const buildJs = require('./tasks/build-js');
const buildSass = require('./tasks/build-sass');
const copyFonts = require('./tasks/copy-fonts');
const watch = require('./tasks/watch');
const package = require('./tasks/package');

const build = parallel(buildJs, buildSass, copyFonts);

task('clean', clean);
task('build', series(clean, build));
task('watch', series(clean, build, watch));
task('package', package);
