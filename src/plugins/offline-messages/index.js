const Dispatcher = require('../../dispatcher');
const Constants = require('../../constants');
const ChatActions = require('../../actions/chat-actions.js');
const FriendsStore = require('../../stores/friends-store.js');

/**
 * Offline Messages
 * Requests and intercepts Steam message which contains chat history.
 */
exports.name = 'punk-offline-messages';

exports.plugin = function(API) {
  const client = API.getClient();
  const log = API.getLogger();
  const Steam = API.getSteam();
  const utils = API.getUtils();

  const token = Dispatcher.register((action) => {
    switch(action.type) {
      case Constants.ChatActions.CHAT_REQUEST_OFFLINE_MESSAGES:
        log.debug('Requesting unread messages.');

        // request all of them
        client.send({
          msg: Steam.EMsg.ClientFSGetFriendMessageHistoryForOfflineMessages,
          proto: {}
        }, new Steam.Internal.CMsgClientFSGetFriendMessageHistoryForOfflineMessages().toBuffer());

        break;

      default:
        // ignore
    }
  });

  API.registerHandler({
    emitter: 'client',
    event: 'message'
  }, (header, body) => {
    // this will trigger for every person separately
    if(header.msg === Steam.EMsg.ClientFSGetFriendMessageHistoryResponse) {
      const response = Steam.Internal.CMsgClientFSGetFriendMessageHistoryResponse.decode(body);

      const unreadMessages = response.messages.filter((message) => message.unread);

      log.debug('# of unread chat messages: %d', unreadMessages.length);

      unreadMessages.forEach((message) => {
        const id = utils.accountIDToSteamID(message.accountid);

        // get username if possible
        let username = id;
        const friend = FriendsStore.getById(id);
        if(friend) {
          username = friend.username;
        }

        // create message
        const incomingMessage = {
          type: Constants.MessageTypes.CHAT_THEIR_MESSAGE,
          sender: id,         // SteamID64 string
          username, // display name if possible
          date: new Date(message.timestamp * 1000),
          text: message.message
        };

        ChatActions.newIncomingMessage(incomingMessage);
      });
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
