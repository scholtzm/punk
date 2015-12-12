var Dispatcher = require('../../dispatcher');
var Constants = require('../../constants');
var ChatActions = require('../../actions/chat-actions.js');

exports.name = 'punk-friendmsg';

exports.plugin = function(API) {
  var Steam = API.getSteam();
  var steamFriends = API.getHandler('steamFriends');

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'friendMsg'
  }, function(user, message, type) {
    if(type === Steam.EChatEntryType.ChatMsg) {
      var username = user;

      // should we ignore ghost messages?
      var persona = steamFriends.personaStates[user];
      if(persona) {
        username = persona.player_name;
      }

      var message = {
        sender: user,           // SteamID64 string
        username: username, // display name if possible
        text: message
      };

      ChatActions.newIncomingMessage(message);
    }
  });

  Dispatcher.register(function(action) {
    switch(action.type) {
      case Constants.ChatActions.CHAT_NEW_OUTGOING_MESSAGE:
        steamFriends.sendMessage(action.message.target, action.message.text);
        break;

      default:
        // ignore
    }
  });

};
