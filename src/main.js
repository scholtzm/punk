var app = require('app');
var BrowserWindow = require('browser-window');
var appMenu = require('./ui/menus/app-menu.js');

var Logger = require('./utils/logger.js');
var Settings = require('./utils/settings.js');

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
  Settings.get('lastWindowState', function(err, data) {
    var lastWindowsState = err && {width: 800, height: 600} || data;

    mainWindow = new BrowserWindow({
      x: lastWindowsState.x,
      y: lastWindowsState.y,
      width: lastWindowsState.width,
      height: lastWindowsState.height,
      minWidth: 400,
      minHeight: 300,
      autoHideMenuBar: true
    });

    mainWindow.loadURL('file://' + __dirname + '/../../static/index.html');

    mainWindow.on('closed', function() {
      mainWindow = null;
    });

    mainWindow.webContents.on('did-finish-load', function() {
      mainWindow.setTitle(title);
      if(lastWindowsState.maximized) {
        mainWindow.maximize();
      }
    });

    mainWindow.on('focus', function() {
      mainWindow.flashFrame(false);
    });

    function preserveWindowState() {
      var currentWindowsState = mainWindow.getBounds();
      currentWindowsState.maximized = mainWindow.isMaximized();

      Settings.set('lastWindowState', currentWindowsState, function(setErr) {
        if(setErr) {
          Logger.error('Failed to save lastWindowState.');
          Logger.error(setErr);
        }
      });
    }

    mainWindow.on('move', preserveWindowState);
    mainWindow.on('resize', preserveWindowState);
    mainWindow.on('maximize', preserveWindowState);
    mainWindow.on('unmaximize', preserveWindowState);

    // register main app menu
    appMenu.register();
  });
});
