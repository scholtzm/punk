var BrowserWindow = require('electron').remote.BrowserWindow;

var win;

function create(cookies) {
  console.log('SteamCommunityWindow: creating');

  if(win) {
    return win;
  }

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

  win.webContents.on('new-window', function(event, url) {
    event.preventDefault();
    console.log('SteamCommunityWindow: opening new url');
    win.loadURL(url);
  });

  cookies = cookies || [];

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

  return win;
}

var SteamCommunityWindow = {
  create: create
};

module.exports = SteamCommunityWindow;
