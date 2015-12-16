var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var FriendsActions = require('../../actions/friends-actions.js');

module.exports = function(friend) {
  var menu = new Menu();

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

  return menu;
};
