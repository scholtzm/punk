var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var UserStore = require('../../stores/user-store.js');
var ChatActions = require('../../actions/chat-actions.js');
var SteamCommunityWindow = require('../windows/steam-community.js');

module.exports = function(notifications) {
  var menu = new Menu();

  var cookies = UserStore.getCookies();

  // if we don't have cookies, abort
  if(cookies.cookies.length === 0) {
    menu.append(new MenuItem({label: 'SteamCommunity.com is currently unavailable.'}));
    return menu;
  }

  function showWindow(url) {
    var win = SteamCommunityWindow.create(cookies.cookies);
    win.loadURL(url);
    win.show();
  }

  menu.append(new MenuItem({
    label: 'Comments: ' + notifications.comments,
    click: function() {
      showWindow('https://steamcommunity.com/my/commentnotifications');
    }
  }));

  menu.append(new MenuItem({
    label: 'Items: ' + notifications.items,
    click: function() {
      showWindow('https://steamcommunity.com/my/inventory');
    }
  }));

  menu.append(new MenuItem({
    label: 'Messages: ' + notifications.messages,
    click: function() {
      ChatActions.requestOfflineMessages();
    }
  }));

  return menu;
};
