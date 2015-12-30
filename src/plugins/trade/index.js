var Constants = require('../../constants');
var Dispatcher = require('../../dispatcher');
var ChatActions = require('../../actions/chat-actions.js');
var UserStore = require('../../stores/user-store.js');

var SteamCommunityWindow = require('../../components/windows/steam-community.js');

exports.name = 'punk-trade';

exports.plugin = function(API) {
  var Steam = API.getSteam();
  var log = API.getLogger();
  var steamFriends = API.getHandler('steamFriends');
  var steamTrading = API.getHandler('steamTrading');

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
    log.debug('Response to our trade request: %d.', response.response);
  };

  callbacks[Steam.EMsg.EconTrading_StartSession] = function(body) {
    var response = Steam.Internal.CMsgTrading_StartSession.decode(body);
    log.debug('Trading session with %s has started.', response.other_steamid);

    var cookies = UserStore.getCookies();

    // if we don't have cookies, abort
    if(cookies.cookies.length === 0) {
      log.debug('Cannot open trade window. Have not received cookies yet.');
      return;
    }

    var win = SteamCommunityWindow.create(cookies.cookies);
    win.loadURL('http://steamcommunity.com/trade/' + response.other_steamid);
    win.show();
  };

  var token = Dispatcher.register(function(action) {
    switch(action.type) {
      case Constants.ChatActions.CHAT_RESPOND_TO_TRADE_REQUEST:
        steamTrading.respondToTrade(action.message.meta.tradeRequestId, action.response);
        log.info('Responded to trade request %s.', action.message.meta.tradeRequestId);
        break;

      default:
        // ignore
    }
  });

  API.registerHandler({
    emitter: 'client',
    event: 'message'
  }, function(header, body) {
    if(header.msg in callbacks) {
      callbacks[header.msg](body);
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
