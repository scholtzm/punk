const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const appMenu = require('./ui/menus/app-menu.js');

const Logger = require('./utils/logger.js')('main');
const Settings = require('./utils/settings.js');

// get this working later? requires submit URL
// require('crash-reporter').start();

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

let mainWindow = null;
const title = `${app.getName() } [v${ app.getVersion() }]`;
const WINDOW_STATE_KEY = 'lastMainWindowState';

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  Settings.get(WINDOW_STATE_KEY, (err, data) => {
    const lastWindowsState = err && { width: 800, height: 600 } || data;

    mainWindow = new BrowserWindow({
      x: lastWindowsState.x,
      y: lastWindowsState.y,
      width: lastWindowsState.width,
      height: lastWindowsState.height,
      minWidth: 400,
      minHeight: 300,
      autoHideMenuBar: true
    });

    mainWindow.loadURL(`file://${__dirname}/../../static/index.html`);

    mainWindow.on('close', (event) => {
      if(process.platform === 'darwin' && !app.quitting) {
        event.preventDefault();
        mainWindow.hide();
      } else {
        mainWindow = null;
      }
    });

    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.setTitle(title);
      if(lastWindowsState.maximized) {
        mainWindow.maximize();
      }
    });

    mainWindow.on('focus', () => {
      mainWindow.flashFrame(false);
    });

    function preserveWindowState() {
      const currentWindowsState = mainWindow.getBounds();
      currentWindowsState.maximized = mainWindow.isMaximized();

      Settings.set(WINDOW_STATE_KEY, currentWindowsState, (setErr) => {
        if(setErr) {
          Logger.error('Failed to save last window state.');
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

app.on('activate', () => {
  mainWindow.show();
});

app.on('before-quit', () => {
  app.quitting = true;
});
