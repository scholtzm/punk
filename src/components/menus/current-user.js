var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var UserActions = require('../../actions/user-actions.js');

var menu = new Menu();

function appendStateOptionToMenu(label, state) {
  menu.append(new MenuItem({
    label: label,
    click: function() {
      UserActions.changeState(state);
    }
  }));
}

appendStateOptionToMenu('Online', 1);
appendStateOptionToMenu('Away', 3);
appendStateOptionToMenu('Busy', 2);
appendStateOptionToMenu('Looking to Play', 6);
appendStateOptionToMenu('Looking to Trade', 5);
appendStateOptionToMenu('Snooze', 4);
appendStateOptionToMenu('Offline', 0);

menu.append(new MenuItem({ type: 'separator' }));

menu.append(new MenuItem({
  label: 'Change name',
  click: function() {
    window.alert('Not implemented yet.');
  }
}));

module.exports = menu;
