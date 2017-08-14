const gulp = require('gulp');
const path = require('path');
const os = require('os');
const del = require('del');
const packager = require('electron-packager');
const zip = require('gulp-zip');

const packageJson = require('../package.json');

const config = require('./config');

module.exports = function package(callback) {
  const toDelete = [
    path.join(config.outputPackagePath, '**', '*')
  ];

  del(toDelete)
    .then(() => {
      const productName = packageJson.productName;
      const appVersion = packageJson.version;
      const electronVersion = packageJson.devDependencies['electron'].replace('^', '');
      const outputFolder = 'package';

      const platform = os.platform();

      let arch = 'x64';
      let icon = 'resources/icon.icns';

      if (platform === 'win32') {
        arch = 'ia32';
        icon = 'resources/icon.ico';
      }

      const options = {
        asar: true,
        dir: '.',
        name: productName,
        overwrite: true,
        out: outputFolder,
        platform,
        arch,
        electronVersion,
        prune: true,
        icon,
        ignore: [
          '/src($|/)',
          '/tasks($|/)',
          '/style($|/)'
        ]
      };

      packager(options, (error, appPaths) => {
        if(error) {
          console.log('electron-packager failed with the following error:');
          console.log(error);
          process.exit(1);
        } else {
          const appPath = appPaths[0];

          console.log(`electron-packager finished packaging ${productName}`);
          console.log(`App path: ${appPath}`);
          console.log(`Platform: ${platform}`);
          console.log(`Arch: ${arch}`);

          gulp.src(path.join(appPath, '**', '*'))
            .pipe(zip(`${productName}-v${appVersion}-${platform}.zip`))
            .pipe(gulp.dest(config.outputPackagePath))
            .on('error', (error) => callback(error))
            .on('end', () => callback());
        }
      });
    })
    .catch(error => callback(error));
};
