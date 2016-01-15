var ChatActions = require('../../actions/chat-actions.js');
var SteamCommunityWindow = require('../windows/steam-community.js');
var notifier = require('node-notifier');

notifier.on('click', function(notifierObject, options) {
  if(options.chat) {
    ChatActions.switchChat(options.chat);
  } else if(options.url) {
    SteamCommunityWindow.open(options.url);
  }
});

module.exports = notifier;
