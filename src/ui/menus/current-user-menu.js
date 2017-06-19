const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const UserActions = require('../../actions/user-actions.js');
const UIActions = require('../../actions/ui-actions.js');

module.exports = function(user) {
  const menu = new Menu();

  function appendStateOptionToMenu(label, state) {
    const type = (state === user.stateEnum) ? 'checkbox' : 'normal';
    const checked = state === user.stateEnum;

    menu.append(new MenuItem({
      label,
      click() {
        UserActions.changeState(state);
      },
      type,
      checked
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
    click() {
      UIActions.changeNameOpenDialog();
    }
  }));

  return menu;
};
