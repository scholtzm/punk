var Dispatcher = require('../../dispatcher');
var Constants = require('../../constants');
var ChatActions = require('../../actions/chat-actions.js');
var Constants = require('../../constants');

exports.name = 'punk-offline-messages';

exports.plugin = function(API) {
  var client = API.getClient();
  var log = API.getLogger();
  var Steam = API.getSteam();
  var utils = API.getUtils();
  var steamFriends = API.getHandler('steamFriends');

  var token = Dispatcher.register(function(action) {
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
  }, function(header, body) {
    // this will trigger for every person separately
    if(header.msg === Steam.EMsg.ClientFSGetFriendMessageHistoryResponse) {
      var response = Steam.Internal.CMsgClientFSGetFriendMessageHistoryResponse.decode(body);

      var unreadMessages = response.messages.filter(function(message) {
        return message.unread;
      });

      log.debug('# of unread chat messages: %d', unreadMessages.length);

      unreadMessages.forEach(function(message) {
        var id = utils.accountIDToSteamID(message.accountid);

        // get username if possible
        var username = id;
        var persona = steamFriends.personaStates[id];
        if(persona) {
          username = persona.player_name;
        }

        // create message
        var message = {
          type: Constants.MessageTypes.CHAT_THEIR_MESSAGE,
          sender: id,         // SteamID64 string
          username: username, // display name if possible
          date: new Date(message.timestamp * 1000),
          text: message.message
        };

        ChatActions.newIncomingMessage(message);
      });
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
