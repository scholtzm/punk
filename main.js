var app = require('app');
var BrowserWindow = require('browser-window');
var appMenu = require('./src/ui/menus/app-menu.js');

// get this working later? requires submit URL
// require('crash-reporter').start();

var mainWindow = null;
var title = app.getName() + ' [v' + app.getVersion() + ']';

app.on('window-all-closed', function() {
  if(process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true
  });

  mainWindow.loadURL('file://' + __dirname + '/static/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.setTitle(title);
  });

  // register main app menu
  appMenu.register();
});
