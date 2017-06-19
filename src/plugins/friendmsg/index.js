const Dispatcher = require('../../dispatcher');
const Constants = require('../../constants');
const ChatActions = require('../../actions/chat-actions.js');

/**
 * Friend Message
 * Takes care of sending and receiving chat messages.
 */
exports.name = 'punk-friendmsg';

exports.plugin = function(API) {
  // Steam client emits typing info only every ~20 seconds so this should be safe.
  const TYPING_TIMEOUT = 21000;

  const Steam = API.getSteam();
  const steamFriends = API.getHandler('steamFriends');
  const typingTimeouts = {};

  const token = Dispatcher.register((action) => {
    switch(action.type) {
      case Constants.ChatActions.CHAT_NEW_OUTGOING_MESSAGE:
        steamFriends.sendMessage(action.message.target, action.message.text);
        break;

      case Constants.ChatActions.WE_ARE_TYPING:
        steamFriends.sendMessage(action.steamId, '', Steam.EChatEntryType.Typing);
        break;

      default:
        // ignore
    }
  });

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'friendMsg'
  }, (user, receivedText, type) => {
    // Steam sends us messages from anyone, even people who are not on our friends list
    if(steamFriends.friends[user] !== Steam.EFriendRelationship.Friend) {
      return;
    }

    if(type === Steam.EChatEntryType.Typing) {
      ChatActions.otherUserIsTyping(user);

      clearTimeout(typingTimeouts[user]);
      typingTimeouts[user] = setTimeout(() => {
        ChatActions.otherUserStoppedTyping(user);
      }, TYPING_TIMEOUT);
    } else if(type === Steam.EChatEntryType.ChatMsg) {
      let username;
      const persona = steamFriends.personaStates[user];
      if(persona) {
        username = persona.player_name;
      }

      const message = {
        type: Constants.MessageTypes.CHAT_THEIR_MESSAGE,
        sender: user,       // SteamID64 string
        username, // display name if possible
        date: new Date(),
        text: receivedText
      };

      ChatActions.newIncomingMessage(message);
    }
  });

  API.registerHandler({
    emitter: 'steamFriends',
    event: 'friendMsgEchoToSender'
  }, (user, message, type) => {
    if(type === Steam.EChatEntryType.ChatMsg) {
      let username = user;

      const persona = steamFriends.personaStates[user];
      if(persona) {
        username = persona.player_name;
      }

      const echoMessage = {
        type: Constants.MessageTypes.CHAT_OUR_MESSAGE,
        target: user,
        username,
        date: new Date(),
        text: message
      };

      ChatActions.echoMessage(echoMessage);
    }
  });

  API.registerHandler({
    emitter: 'plugin',
    plugin: '*',
    event: 'logout'
  }, () => {
    Dispatcher.unregister(token);
  });
};
