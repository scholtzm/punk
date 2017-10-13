const gulp = require('gulp');
const path = require('path');
const os = require('os');
const del = require('del');
const packager = require('electron-packager');
const zip = require('gulp-zip');
const { argv } = require('yargs');

const packageJson = require('../package.json');

const config = require('./config');

const platform = argv.platform || os.platform();
const outputFolder = path.join(config.outputPackagePath, platform);

module.exports = function package(callback) {
  const toDelete = [
    path.join(outputFolder, '**', '*')
  ];

  del(toDelete)
    .then(() => {
      const productName = packageJson.productName;
      const appVersion = packageJson.version;
      const electronVersion = packageJson.devDependencies['electron'].replace('^', '');

      let arch;
      let icon;
      if(platform === 'darwin') {
        arch = 'x64';
        icon = 'resources/icon.icns';
      } else if (platform === 'win32') {
        arch = 'ia32';
        icon = 'resources/icon.ico';
      } else {
        throw new Error(`Platform not supported: ${platform}`);
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
          '/style($|/)',
          '/package($|/)',
          '/resources($|/)'
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
            .pipe(zip(`${productName}-v${appVersion}-${platform}-ev${electronVersion}.zip`))
            .pipe(gulp.dest(outputFolder))
            .on('error', (gulpErr) => callback(gulpErr))
            .on('end', () => callback());
        }
      });
    })
    .catch(error => callback(error));
};
