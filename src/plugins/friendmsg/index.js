var Dispatcher = require('../../dispatcher');
var Constants = require('../../constants');
var ChatActions = require('../../actions/chat-actions.js');
var Constants = require('../../constants');

/**
 * Friend Message
 * Takes care of sending and receiving chat messages.
 */
exports.name = 'punk-friendmsg';

exports.plugin = function(API) {
  var Steam = API.getSteam();
  var steamFriends = API.getHandler('steamFriends');

  var token = Dispatcher.register(function(action) {
    switch(action.type) {
      case Constants.ChatActions.CHAT_NEW_OUTGOING_MESSAGE:
        steamFriends.sendMessage(action.message.target, action.message.text);
        break;

      default:
        // ignore
    }
  });

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'friendMsg'
  }, function(user, message, type) {
    // Steam sends us messages from anyone, even people who are not on our friends list
    if(steamFriends.friends[user] !== Steam.EFriendRelationship.Friend) {
      return;
    }

    if(type === Steam.EChatEntryType.Typing) {
      // TODO implement 'is typing' recognition
    } else if(type === Steam.EChatEntryType.ChatMsg) {
      var username = user;

      var persona = steamFriends.personaStates[user];
      if(persona) {
        username = persona.player_name;
      }

      var message = {
        type: Constants.MessageTypes.CHAT_THEIR_MESSAGE,
        sender: user,       // SteamID64 string
        username: username, // display name if possible
        date: new Date(),
        text: message
      };

      ChatActions.newIncomingMessage(message);
    }
  });

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'friendMsgEchoToSender'
  }, function(user, message, type) {
    if(type === Steam.EChatEntryType.ChatMsg) {
      var username = user;

      var persona = steamFriends.personaStates[user];
      if(persona) {
        username = persona.player_name;
      }

      var message = {
        type: Constants.MessageTypes.CHAT_OUR_MESSAGE,
        target: user,
        username: username,
        date: new Date(),
        text: message
      };

      ChatActions.echoMessage(message);
    }
  });

  API.registerHandler({
    emitter: 'plugin',
    plugin: '*',
    event: 'logout'
  }, function() {
    Dispatcher.unregister(token);
  });
};
