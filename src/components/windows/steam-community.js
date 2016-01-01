var BrowserWindow = require('electron').remote.BrowserWindow;
var UserStore = require('../../stores/user-store.js');

var win;
var USER_AGENT = 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; Valve Steam Client/1451445940; ) ' +
                 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.49 Safari/537.36';

function open(url) {
  var cookies = UserStore.getWebSession().cookies;

  // if we don't have cookies, abort
  if(cookies.length === 0) {
    console.log('SteamCommunityWindow: cookies are missing');
    return;
  }

  if(win) {
    console.log('SteamCommunityWindow: reusing existing instance');
    win.loadURL(url);
    return win;
  }

  console.log('SteamCommunityWindow: creating');

  win = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    center: true,
    title: 'Loading...',
    webPreferences: {
      nodeIntegration: false
    },
    autoHideMenuBar: true
  });

  win.on('closed', function() {
    win = null;
  });

  win.webContents.on('new-window', function(event, newUrl) {
    event.preventDefault();
    console.log('SteamCommunityWindow: opening new url');
    win.loadURL(newUrl);
  });

  cookies.forEach(function(cookie) {
    var split = cookie.split('=');

    win.webContents.session.cookies.set({
      url : 'https://steamcommunity.com',
      name : split[0],
      value : split[1],
      session: split[0].indexOf('steamLogin') > -1 ? true : false,
      secure: split[0] === 'steamLoginSecure'
    }, function(){});

    win.webContents.session.cookies.set({
      url : 'https://store.steampowered.com',
      name : split[0],
      value : split[1],
      session: split[0].indexOf('steamLogin') > -1 ? true : false,
      secure: split[0] === 'steamLoginSecure'
    }, function(){});
  });

  win.loadURL(url, { userAgent: USER_AGENT });
  win.show();
}

var SteamCommunityWindow = {
  open: open
};

module.exports = SteamCommunityWindow;
