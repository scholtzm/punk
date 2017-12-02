const SteamUser = require('steam-user');
const Logger = require('../../utils/logger')('plugin:offline-messages');

const Dispatcher = require('../../dispatcher');
const Constants = require('../../constants');
const ChatActions = require('../../actions/chat-actions.js');
const FriendsStore = require('../../stores/friends-store.js');

/**
 * Offline Messages
 * Requests and intercepts Steam message which contains chat history.
 */
module.exports = function(steamUser) {
  Dispatcher.register((action) => {
    switch(action.type) {
      case Constants.ChatActions.CHAT_REQUEST_OFFLINE_MESSAGES:
        Logger.debug('Requesting unread messages.');

        // request all of them
        // TODO: FIXME: Using private property
        steamUser._send(SteamUser.EMsg.ClientFSGetFriendMessageHistoryForOfflineMessages);

        break;

      default:
        // ignore
    }
  });

  steamUser.on('chatHistory', (sid, messages) => {
    const unreadMessages = messages.filter((message) => message.unread);

    unreadMessages.forEach((message) => {
      const id = sid.getSteamID64();

      // get username if possible
      let username = id;
      const friend = FriendsStore.getById(id);
      if (friend) {
        username = friend.username;
      }

      // create message
      const incomingMessage = {
        type: Constants.MessageTypes.CHAT_THEIR_MESSAGE,
        sender: id, // SteamID64 string
        username,   // display name if possible
        date: message.timestamp,
        text: message.message
      };

      ChatActions.newIncomingMessage(incomingMessage);
    });
  });
};
