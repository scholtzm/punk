var remote = require('electron').remote;
var Menu = remote.Menu;
var MenuItem = remote.MenuItem;

var FriendsActions = require('../../actions/friends-actions.js');
var SteamCommunityWindow = require('../windows/steam-community.js');

module.exports = function(friend) {
  var menu = new Menu();

  menu.append(new MenuItem({
    label: 'View Steam profile',
    click: function() {
      SteamCommunityWindow.open('https://steamcommunity.com/profiles/' + friend.id);
    }
  }));

  if(friend.relationshipEnum === 2) {
    menu.append(new MenuItem({
      label: 'Accept friend request',
      click: function() {
        FriendsActions.add(friend.id);
      }
    }));

    menu.append(new MenuItem({
      label: 'Decline friend request',
      click: function() {
        FriendsActions.remove(friend);
      }
    }));
  } else if(friend.relationshipEnum === 3) {
    menu.append(new MenuItem({
      label: 'Send trade request',
      click: function() {
        FriendsActions.sendTradeRequest(friend);
      }
    }));

    menu.append(new MenuItem({
      label: 'Remove from friends',
      click: function() {
        FriendsActions.remove(friend);
      }
    }));

    menu.append(new MenuItem({
      label: 'Block communication',
      click: function() {
        FriendsActions.block(friend);
      }
    }));
  } else if(friend.relationshipEnum === 4) {
    menu.append(new MenuItem({
      label: 'Cancel outstanding friend request',
      click: function() {
        FriendsActions.remove(friend);
      }
    }));
  }

  return menu;
};
