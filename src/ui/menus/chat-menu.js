var remote = require('electron').remote;
var Menu = remote.Menu;
var MenuItem = remote.MenuItem;

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
