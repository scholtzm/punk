const Dispatcher = require('../dispatcher');
const Constants = require('../constants');

const ChatActions = {

  newIncomingMessage(message) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_NEW_INCOMING_MESSAGE,
      message
    });
  },

  newOutgoingMessage(message) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_NEW_OUTGOING_MESSAGE,
      message
    });
  },

  echoMessage(message) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_ECHO_MESSAGE,
      message
    });
  },

  openChat(user) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_OPEN,
      user
    });
  },

  switchChat(chat) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_SWITCH,
      chat
    });
  },

  closeChat(chat) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_CLOSE,
      chat
    });
  },

  clearChat(chat) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_CLEAR,
      chat
    });
  },

  requestOfflineMessages() {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_REQUEST_OFFLINE_MESSAGES
    });
  },

  respondToTradeRequest(chat, message, response) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_RESPOND_TO_TRADE_REQUEST,
      chat,
      message,
      response
    });
  },

  incomingTradeRequestResponse(response) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_INCOMING_TRADE_REQUEST_RESPONSE,
      response
    });
  },

  cancelTradeRequest(id) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.CHAT_CANCEL_TRADE_REQUEST,
      id
    });
  },

  otherUserIsTyping(steamId) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.OTHER_USER_IS_TYPING,
      steamId
    });
  },

  otherUserStoppedTyping(steamId) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.OTHER_USER_STOPPED_TYPING,
      steamId
    });
  },

  weAreTyping(steamId) {
    Dispatcher.dispatch({
      type: Constants.ChatActions.WE_ARE_TYPING,
      steamId
    });
  }
};

module.exports = ChatActions;
