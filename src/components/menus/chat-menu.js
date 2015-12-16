var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var ChatActions = require('../../actions/chat-actions.js');

module.exports = function(chat) {
  var menu = new Menu();

  menu.append(new MenuItem({
    label: 'Clear chat messages',
    click: function() {
      ChatActions.clearChat(chat);
    }
  }));

  return menu;
};
