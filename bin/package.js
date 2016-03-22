#!/usr/bin/env node

var path = require('path');
var packager = require('electron-packager');
var rimraf = require('rimraf');
var shell = require('shelljs');
var packageJson = require('./../package.json');

var productName = packageJson.productName;
var appVersion = packageJson.version;
var electronVersion = packageJson.devDependencies['electron-prebuilt'];
var outputFolder = 'package';

var platform = 'darwin';
var arch = 'x64';
var icon = 'resources/icon.icns';

if (process.argv[2] === '--win32') {
  platform = 'win32';
  arch = 'ia32';
  icon = 'resource/icon.ico';
}

var options = {
  dir: '.',
  name: productName,
  overwrite: true,
  out: outputFolder,
  platform: platform,
  arch: arch,
  version: electronVersion,
  prune: true,
  icon: icon,
  ignore: [
    '/src($|/)',
    '/bin($|/)',
    '/style($|/)'
  ]
};

rimraf(path.join('.', outputFolder), function(removeErr) {
  if(removeErr) {
    console.log('Failed to remove files');
    console.log(removeErr);
    process.exit(1);
  }

  packager(options, function(error, appPaths) {
    var appPath = appPaths[0];

    if(error) {
      console.log('electron-packager failed with the following error:');
      console.log(error);
      process.exit(1);
    } else {
      console.log('electron-packager finished packaging ' + productName);
      console.log('App path: ' + appPath);
      console.log('Platform: ' + platform);
      console.log('Arch: ' + arch);

      if(platform === 'darwin') {
        createOsxPackage(appPath);
      }
    }
  });
});

function createOsxPackage(appPath) {
  process.chdir(path.join('.', appPath));

  var zipName = productName + '-v' + appVersion + '-osx.zip';
  var appName = productName + '.app';
  var dittoCommand = 'ditto -c -k --sequesterRsrc --keepParent ' + appName + ' ' + zipName;

  shell.exec(dittoCommand, function(code) {
    console.log('Ditto command exit code:', code);
  });
}
