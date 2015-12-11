var Dispatcher = require('../dispatcher');
var Constants = require('../constants');

var ChatActions = {

  newIncomingMessage: function(message) {
    Dispatcher.dispatch({
      type: Constants.CHAT_NEW_FRIEND_MESSAGE,
      message: message
    });
  }

};

module.exports = ChatActions;
