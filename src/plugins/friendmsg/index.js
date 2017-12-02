const SteamUser = require('steam-user');

const Dispatcher = require('../../dispatcher');
const Constants = require('../../constants');
const ChatActions = require('../../actions/chat-actions.js');

/**
 * Friend Message
 * Takes care of sending and receiving chat messages.
 */
module.exports = function(steamUser) {
  // Steam client emits typing info only every ~20 seconds so this should be safe.
  const TYPING_TIMEOUT = 21000;
  const typingTimeouts = {};

  Dispatcher.register((action) => {
    switch(action.type) {
      case Constants.ChatActions.CHAT_NEW_OUTGOING_MESSAGE:
        steamUser.chatMessage(action.message.target, action.message.text);
        break;

      case Constants.ChatActions.WE_ARE_TYPING:
        steamUser.chatTyping(action.steamId);
        break;

      default:
        // ignore
    }
  });

  steamUser.on('friendMessage', (sid, receivedText) => {
    const id = sid.getSteamID64();

    // Steam sends us messages from anyone, even people who are not on our friends list
    if (steamUser.myFriends[id] !== SteamUser.EFriendRelationship.Friend) {
      return;
    }

    let username;
    const persona = steamUser.users[id];
    if (persona) {
      username = persona.player_name;
    }

    const message = {
      type: Constants.MessageTypes.CHAT_THEIR_MESSAGE,
      sender: id, // SteamID64 string
      username,   // display name if possible
      date: new Date(),
      text: receivedText
    };

    ChatActions.newIncomingMessage(message);
  });

  steamUser.on('friendTyping', (sid) => {
    const id = sid.getSteamID64();

    // Steam sends us messages from anyone, even people who are not on our friends list
    if (steamUser.myFriends[id] !== SteamUser.EFriendRelationship.Friend) {
      return;
    }

    ChatActions.otherUserIsTyping(id);

    clearTimeout(typingTimeouts[id]);
    typingTimeouts[id] = setTimeout(() => {
      ChatActions.otherUserStoppedTyping(id);
    }, TYPING_TIMEOUT);
  });

  steamUser.on('friendMessageEcho', (sid, message) => {
    const id = sid.getSteamID64();
    let username = id;

    const persona = steamUser.users[id];
    if (persona) {
      username = persona.player_name;
    }

    const echoMessage = {
      type: Constants.MessageTypes.CHAT_OUR_MESSAGE,
      target: id,
      username,
      date: new Date(),
      text: message
    };

    ChatActions.echoMessage(echoMessage);
  });
};
