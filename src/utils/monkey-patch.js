/**
 * Asar does not allow `process.chdir` which is used by steam-resources
 *
 * https://github.com/scholtzm/punk/issues/22
 * https://github.com/electron/electron/issues/8206
 */

const path = require('path');

let cwd = '';

const specialFiles = [
  'steammsg.steamd',
  'header.steamd',
  'emsg.steamd',
  'eresult.steamd',
  'enums.steamd',
  'netheader.steamd',
  'gamecoordinator.steamd'
];

process.chdir = (newPath) => {
  cwd = newPath;
};

const originalReadFileSync = require('fs').readFileSync;

require('fs').readFileSync = (filePath, ...args) => {
  let newPath = filePath;

  if(specialFiles.includes(filePath)) {
    newPath = path.join(cwd, filePath);
  }

  return originalReadFileSync(newPath, ...args);
};
