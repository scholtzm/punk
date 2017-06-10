const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const ChatActions = require('../../actions/chat-actions.js');
const SteamCommunityWindow = require('../windows/steam-community.js');

const labels = {
  gameTurns: 'Game turns',
  moderatorMessages: 'Moderator messages',
  comments: 'Comments',
  items: 'Items',
  invites: 'Invites',
  gifts: 'Gifts',
  messages: 'Messages',
  helpRequestReplies: 'Help request replies',
  accountAlerts: 'Account alerts'
};

const clickHandlers = {
  gameTurns: () => SteamCommunityWindow.open('https://steamcommunity.com/my'),
  moderatorMessages: () => SteamCommunityWindow.open('https://steamcommunity.com/my'),
  comments: () => SteamCommunityWindow.open('https://steamcommunity.com/my/commentnotifications'),
  items: () => SteamCommunityWindow.open('https://steamcommunity.com/my/inventory'),
  invites: () => SteamCommunityWindow.open('https://steamcommunity.com/my/home/invites'),
  gifts: () => SteamCommunityWindow.open('https://steamcommunity.com/my'),
  messages: () => ChatActions.requestOfflineMessages(),
  helpRequestReplies: () => SteamCommunityWindow.open('https://steamcommunity.com/my'),
  accountAlerts: () => SteamCommunityWindow.open('https://steamcommunity.com/my')
};

function appendMenuItem(menu, label, click) {
  menu.append(new MenuItem({
    label,
    click
  }));
}

function appendEmptyMenuItem(menu) {
  menu.append(new MenuItem({
    label: 'There are no new notifications'
  }));
}

module.exports = function(notifications) {
  const menu = new Menu();

  const count = Object.keys(notifications)
    .map(key => notifications[key])
    .reduce((a, b) => a + b, 0);

  if(count > 0) {
    Object.keys(labels).forEach(key => {
      if(notifications[key] > 0) {
        const fullLabel = `${labels[key]}: ${notifications[key]}`;
        const clickHandler = clickHandlers[key];

        appendMenuItem(menu, fullLabel, clickHandler);
      }
    });
  } else {
    appendEmptyMenuItem(menu);
  }

  return menu;
};
