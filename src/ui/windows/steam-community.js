const BrowserWindow = require('electron').remote.BrowserWindow;
const UserStore = require('../../stores/user-store.js');
const Logger = require('../../utils/logger.js')('sc-window');
const urlHelper = require('../../utils/url-helper.js');
const Settings = require('../../utils/settings.js');

let win;
const WINDOW_STATE_KEY = 'lastSteamCommunityWindowState';

// official Steam client uses this as their user agent
const USER_AGENT = 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; Valve Steam Client/1451445940; ) ' + // eslint-disable-line no-unused-vars
                 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.49 Safari/537.36';

function open(url) {
  const cookies = UserStore.getWebSession().cookies;

  // if we don't have cookies, abort
  if(cookies.length === 0) {
    Logger.debug('SteamCommunityWindow: cookies are missing');
    return;
  }

  if(win) {
    Logger.debug('SteamCommunityWindow: reusing existing instance');
    win.loadURL(url);
    return win;
  }

  Logger.debug('SteamCommunityWindow: creating new instance');

  Settings.get(WINDOW_STATE_KEY, (err, data) => {
    const lastWindowsState = err && { width: 1024, height: 768 } || data;

    win = new BrowserWindow({
      x: lastWindowsState.x,
      y: lastWindowsState.y,
      width: lastWindowsState.width,
      height: lastWindowsState.height,
      show: false,
      title: 'Loading...',
      webPreferences: {
        nodeIntegration: false,
        allowDisplayingInsecureContent: true,
        allowRunningInsecureContent: true
      },
      autoHideMenuBar: true
    });

    win.on('closed', () => {
      win = null;
    });

    win.webContents.on('new-window', (event, newUrl) => {
      event.preventDefault();

      if(urlHelper.isSteamUrl(newUrl)) {
        win.loadURL(newUrl);
      } else {
        urlHelper.openExternal(newUrl);
      }
    });

    win.webContents.on('did-finish-load', () => {
      if(lastWindowsState.maximized) {
        win.maximize();
      }
    });

    cookies.forEach((cookie) => {
      const split = cookie.split('=');

      win.webContents.session.cookies.set({
        url : 'https://steamcommunity.com',
        name : split[0],
        value : split[1],
        session: split[0].indexOf('steamLogin') > -1 ? true : false,
        secure: split[0] === 'steamLoginSecure'
      }, () => {});

      win.webContents.session.cookies.set({
        url : 'https://store.steampowered.com',
        name : split[0],
        value : split[1],
        session: split[0].indexOf('steamLogin') > -1 ? true : false,
        secure: split[0] === 'steamLoginSecure'
      }, () => {});
    });

    function preserveWindowState() {
      const currentWindowsState = win.getBounds();
      currentWindowsState.maximized = win.isMaximized();

      Settings.set(WINDOW_STATE_KEY, currentWindowsState, (setErr) => {
        if(setErr) {
          Logger.error('Failed to save last window state.');
          Logger.error(setErr);
        }
      });
    }

    win.on('move', preserveWindowState);
    win.on('resize', preserveWindowState);
    win.on('maximize', preserveWindowState);
    win.on('unmaximize', preserveWindowState);

    win.loadURL(url);
    win.show();
  });
}

const SteamCommunityWindow = {
  open
};

module.exports = SteamCommunityWindow;
