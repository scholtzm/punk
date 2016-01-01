var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var ChatActions = require('../../actions/chat-actions.js');
var SteamCommunityWindow = require('../windows/steam-community.js');

module.exports = function(notifications) {
  var menu = new Menu();

  menu.append(new MenuItem({
    label: 'Comments: ' + notifications.comments,
    click: function() {
      SteamCommunityWindow.open('https://steamcommunity.com/my/commentnotifications');
    }
  }));

  menu.append(new MenuItem({
    label: 'Items: ' + notifications.items,
    click: function() {
      SteamCommunityWindow.open('https://steamcommunity.com/my/inventory');
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
