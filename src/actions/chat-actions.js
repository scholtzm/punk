var Dispatcher = require('../dispatcher');
var Constants = require('../constants');

var ChatActions = {

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
  }

};

module.exports = ChatActions;
