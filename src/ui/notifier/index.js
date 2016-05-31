var notifier = require('node-notifier');
var remote = require('electron').remote;

var Constants = require('../../constants');
var ChatActions = require('../../actions/chat-actions.js');
var SteamCommunityWindow = require('../windows/steam-community.js');
var urlHelper = require('../../utils/url-helper.js');

var soundPath = 'sounds/beep.mp3';
var iconPath = __dirname + '/../../../../static/image/icon.png';

notifier.on('click', function(notifierObject, options) {
  if(!options.meta) {
    return;
  }

  switch(options.meta.action) {
    case Constants.UIActions.UI_NOTIFICATION_OPEN_URL:
      var url = options.meta.url;

      if(urlHelper.isSteamUrl(url)) {
        SteamCommunityWindow.open(url);
      } else {
        urlHelper.openExternal(url);
      }
      break;

    case Constants.UIActions.UI_NOTIFICATION_SWITCH_CHAT:
      ChatActions.switchChat(options.meta.chat);
      break;

    default:
      // ignore
  }
});

var notifications = {};

notifications.flash = function(mode) {
  mode = mode || 'informational';

  if(process.platform === 'darwin') {
    remote.app.dock.bounce(mode);
  }
  remote.getCurrentWindow().flashFrame(true);
};

notifications.playSound = function() {
  var beep = new Audio(soundPath);
  beep.play();
};

notifications.friend = function() {
  var options = {
    title: 'New friend request',
    message: 'You have received a friend request!',
    icon: iconPath,
    wait: true
  };

  notifier.notify(options);

  this.playSound();
  this.flash('critical');
};

notifications.tradeOffer = function() {
  var options = {
    title: 'New trade offer',
    message: 'You have new pending trade offer!',
    icon: iconPath,
    wait: true,
    meta: {
      action: Constants.UIActions.UI_NOTIFICATION_OPEN_URL,
      url: 'https://steamcommunity.com/my/tradeoffers'
    }
  };

  notifier.notify(options);

  this.playSound();
  this.flash('critical');
};

notifications.message = function(options) {
  var notificationOptions = {
    title: options.username + ' says:',
    message: options.text,
    icon: iconPath,
    wait: true,
    meta: {
      action: Constants.UIActions.UI_NOTIFICATION_SWITCH_CHAT,
      chat: options.chat
    }
  };

  notifier.notify(notificationOptions);

  if(options.playSound) {
    this.playSound();
  }

  if(options.flash) {
    this.flash(options.flashMode);
  }
};

module.exports = notifications;
