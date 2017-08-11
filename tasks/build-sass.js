const { src, dest } = require('gulp');
const sass = require('gulp-sass');

const config = require('./config');

module.exports = function buildCss() {
  return src(config.sassPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(config.outputCssPath));
};
