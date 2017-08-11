const { src, dest } = require('gulp');

const config = require('./config');

module.exports = function copyFonts() {
  return src(config.fontPath)
    .pipe(dest(config.outputFontPath));
};
