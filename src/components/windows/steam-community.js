var BrowserWindow = require('electron').remote.BrowserWindow;

function create(cookies) {
  var win = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    center: true,
    skipTaskbar: true,
    title: 'Loading...',
    webPreferences: {
      nodeIntegration: false
    }
  });

  win.webContents.on('new-window', function(event, url) {
    event.preventDefault();
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
