var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var UserActions = require('../../actions/user-actions.js');

var menu = new Menu();

menu.append(new MenuItem({
  label: 'Online',
  click: function() {
    UserActions.changeState(1);
  }
}));

menu.append(new MenuItem({
  label: 'Away',
  click: function() {
    UserActions.changeState(3);
  }
}));

menu.append(new MenuItem({
  label: 'Busy',
  click: function() {
    UserActions.changeState(2);
  }
}));

menu.append(new MenuItem({
  label: 'Looking to Play',
  click: function() {
    UserActions.changeState(6);
  }
}));

menu.append(new MenuItem({
  label: 'Looking to Trade',
  click: function() {
    UserActions.changeState(5);
  }
}));

menu.append(new MenuItem({
  label: 'Snooze',
  click: function() {
    UserActions.changeState(4);
  }
}));

menu.append(new MenuItem({
  label: 'Offline',
  click: function() {
    UserActions.changeState(0);
  }
}));

menu.append(new MenuItem({ type: 'separator' }));

menu.append(new MenuItem({
  label: 'Change name',
  click: function() {
    window.alert('Not implemented yet.');
  }
}));

module.exports = menu;
