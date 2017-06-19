#!/usr/bin/env node

const path = require('path');
const packager = require('electron-packager');
const rimraf = require('rimraf');
const shell = require('shelljs');
const packageJson = require('./../package.json');

const productName = packageJson.productName;
const appVersion = packageJson.version;
const electronVersion = packageJson.dependencies['electron'];
const outputFolder = 'package';

let platform = 'darwin';
let arch = 'x64';
let icon = 'resources/icon.icns';

if (process.argv[2] === '--win32') {
  platform = 'win32';
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
  version: electronVersion,
  prune: true,
  icon,
  ignore: [
    '/src($|/)',
    '/scripts($|/)',
    '/style($|/)'
  ]
};

rimraf(path.join('.', outputFolder), (removeErr) => {
  if(removeErr) {
    console.log('Failed to remove files');
    console.log(removeErr);
    process.exit(1);
  }

  packager(options, (error, appPaths) => {
    const appPath = appPaths[0];

    if(error) {
      console.log('electron-packager failed with the following error:');
      console.log(error);
      process.exit(1);
    } else {
      console.log(`electron-packager finished packaging ${ productName}`);
      console.log(`App path: ${ appPath}`);
      console.log(`Platform: ${ platform}`);
      console.log(`Arch: ${ arch}`);

      if(platform === 'darwin') {
        createOsxPackage(appPath);
      } else if(platform === 'win32') {
        createWindowsPackage();
      }
    }
  });
});

function createOsxPackage(appPath) {
  process.chdir(path.join('.', appPath));

  const zipName = `${productName }-v${ appVersion }-osx.zip`;
  const appName = `${productName }.app`;
  const dittoCommand = `ditto -c -k --sequesterRsrc --keepParent ${ appName } ${ zipName}`;

  shell.exec(dittoCommand, (code) => {
    console.log('Ditto command exit code:', code);
  });
}

function createWindowsPackage() {
  process.chdir(path.join('.', outputFolder));

  const folderName = `${productName }-${ platform }-${ arch}`;
  const appName = `${productName }-v${ appVersion }-${ platform}`;
  const zipName = `${appName }.zip`;

  shell.exec(`rename ${ folderName } ${ appName}`, (renameExitCode) => {
    console.log('Rename exit code:', renameExitCode);

    // assumes 7z.exe is in PATH
    shell.exec(`7z a ${ zipName } ${ appName } > nul`, (zipExitCode) => {
      console.log(`7zip exit code: ${ zipExitCode}`);
    });
  });
}
