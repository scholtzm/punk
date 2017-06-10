const Dispatcher = require('../dispatcher');
const Constants = require('../constants');

const ChatActions = {

  newIncomingMessage: function(message) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_NEW_INCOMING_MESSAGE,
      message: message
    });
  },

  newOutgoingMessage: function(message) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_NEW_OUTGOING_MESSAGE,
      message: message
    });
  },

  echoMessage: function(message) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_ECHO_MESSAGE,
      message: message
    });
  },

  openChat: function(user) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_OPEN,
      user: user
    });
  },

  switchChat: function(chat) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_SWITCH,
      chat: chat
    });
  },

  closeChat: function(chat) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_CLOSE,
      chat: chat
    });
  },

  clearChat: function(chat) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_CLEAR,
      chat: chat
    });
  },

  requestOfflineMessages: function() {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_REQUEST_OFFLINE_MESSAGES
    });
  },

  respondToTradeRequest: function(chat, message, response) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_RESPOND_TO_TRADE_REQUEST,
      chat: chat,
      message: message,
      response: response
    });
  },

  incomingTradeRequestResponse: function(response) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_INCOMING_TRADE_REQUEST_RESPONSE,
      response: response
    });
  },

  cancelTradeRequest: function(id) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_CANCEL_TRADE_REQUEST,
      id: id
    });
  },

  otherUserIsTyping: function(steamId) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.OTHER_USER_IS_TYPING,
      steamId: steamId
    });
  },

  otherUserStoppedTyping: function(steamId) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.OTHER_USER_STOPPED_TYPING,
      steamId: steamId
    });
  },

  weAreTyping: function(steamId) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.WE_ARE_TYPING,
      steamId: steamId
    });
  }
};

module.exports = ChatActions;
