const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const ChatActions = require('../../actions/chat-actions.js');

module.exports = function(chat) {
  const menu = new Menu();

  menu.append(new MenuItem({
    label: 'Clear chat messages',
    click() {
      ChatActions.clearChat(chat);
    }
  }));

  return menu;
};
