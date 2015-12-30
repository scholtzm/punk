var Constants = require('../../constants');
var ChatActions = require('../../actions/chat-actions.js');

exports.name = 'punk-trade';

exports.plugin = function(API) {
  var Steam = API.getSteam();
  var log = API.getLogger();
  var steamFriends = API.getHandler('steamFriends');

  var callbacks = {};

  callbacks[Steam.EMsg.EconTrading_InitiateTradeProposed] = function(body) {
    var response = Steam.Internal.CMsgTrading_InitiateTradeRequest.decode(body);
    log.debug('Received trade request from %s.', response.other_steamid);

    // response.other_name is always null so we use personaStates if possible
    var username = response.other_steamid;
    var persona = steamFriends.personaStates[response.other_steamid];
    if(persona) {
      username = persona.player_name;
    }

    // trade request is just a special type of message with extra meta data
    var message = {
      type: Constants.MessageTypes.CHAT_THEIR_TRADE_REQUEST,
      sender: response.other_steamid, // SteamID64 string
      username: username,             // display name if possible
      date: new Date(),
      text: username + ' has invited you to trade items.',
      meta: {
        tradeRequestId: response.trade_request_id
      }
    };

    ChatActions.newIncomingMessage(message);
  };

  callbacks[Steam.EMsg.EconTrading_InitiateTradeResult] = function(body) {
    var response = Steam.Internal.CMsgTrading_InitiateTradeResponse.decode(body);
    log.debug('Trade request response: %d.', response.response);
  };

  callbacks[Steam.EMsg.EconTrading_StartSession] = function(body) {
    var response = Steam.Internal.CMsgTrading_StartSession.decode(body);
    log.debug('Trading session with %s has started.', response.other_steamid);
  };

  API.registerHandler({
    emitter: 'client',
    event: 'message'
  }, function(header, body) {
    if(header.msg in callbacks) {
      callbacks[header.msg](body);
    }
  });
};
