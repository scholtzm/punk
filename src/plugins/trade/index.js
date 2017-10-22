const SteamUser = require('steam-user');

const Logger = require('../../utils/logger')('plugin:trade');

const Constants = require('../../constants');
const Dispatcher = require('../../dispatcher');
const ChatActions = require('../../actions/chat-actions.js');

const SteamCommunityWindow = require('../../ui/windows/steam-community.js');

/**
 * Trade
 * Handles sending, receiving, accepting, declining and cancelling trade requests.
 */
module.exports = function(steamUser) {
  steamUser.on('tradeRequest', (sid, respond) => {
    const id = sid.getSteamID64();

    Logger.debug('Received trade request from %s.', id);

    // Steam sends us trade requests from anyone, even people who are not on our friends list
    if (steamUser.myFriends[id] !== SteamUser.EFriendRelationship.Friend) {
      return;
    }

    // response.other_name is always null so we use personaStates if possible
    let username = id;
    const persona = steamUser.users[id];
    if (persona) {
      username = persona.player_name;
    }

    // trade request is just a special type of message with extra meta data
    const message = {
      type: Constants.MessageTypes.CHAT_THEIR_TRADE_REQUEST,
      sender: id, // SteamID64 string
      username,             // display name if possible
      date: new Date(),
      text: `${username} has invited you to trade items.`,
      meta: {
        respond
      }
    };

    ChatActions.newIncomingMessage(message);
  });

  steamUser.on('tradeResponse', (sid, response) => {
    const id = sid.getSteamID64();
    const description = SteamUser.EEconTradeResponse[response];

    Logger.debug('Response to trade request: %d (%s).', response, description);

    // if (response === SteamUser.EEconTradeResponse.Cancel) {
    //   // we need to decline the trade request for whatever reason
    //   // this is also how official Steam client does things
    //   if (response.trade_request_id !== 0) {
    //     steamTrading.respondToTrade(response.trade_request_id, false);
    //   } else {
    //     const tradeRequestId = ChatStore.getLastIncomingTradeRequestId(response.other_steamid);
    //     if (tradeRequestId) {
    //       log.debug('Declined cancelled trade request.');
    //       steamTrading.respondToTrade(tradeRequestId, false);
    //     }
    //   }
    // }

    const tradeRequestResponse = {
      response,
      responseEnum: description,
      id
    };

    ChatActions.incomingTradeRequestResponse(tradeRequestResponse);
  });

  steamUser.on('tradeStarted', (sid) => {
    const id = sid.getSteamID64();
    Logger.debug('Trading session with %s has started.', id);

    // must be http otherwise 'tradestatus' (and possibly other stuff) does not work
    SteamCommunityWindow.open(`http://steamcommunity.com/trade/${id}`);
  });

  Dispatcher.register((action) => {
    switch(action.type) {
      case Constants.FriendsActions.FRIENDS_SEND_TRADE_REQUEST:
        steamUser.trade(action.friend.id);
        Logger.debug(`Sent a trade request to ${action.friend.username}`);
        break;

      case Constants.ChatActions.CHAT_CANCEL_TRADE_REQUEST:
        steamUser.cancelTradeRequest(action.id);
        Logger.debug('Cancelled trade request sent to %s.', action.id);
        break;

      default:
        // ignore
    }
  });
};
