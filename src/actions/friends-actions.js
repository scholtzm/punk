const Dispatcher = require('../dispatcher');
const Constants = require('../constants');

const FriendsActions = {

  init: function(friends) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_INIT,
      friends: friends
    });
  },

  insertOrUpdate: function(friend) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_INSERT_OR_UPDATE,
      friend: friend
    });
  },

  remove: function(friend) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_REMOVE,
      friend: friend
    });
  },

  block: function(friend) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_BLOCK,
      friend: friend
    });
  },

  unblock: function(friend) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_UNBLOCK,
      friend: friend
    });
  },

  add: function(id) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_ADD,
      id: id
    });
  },

  sendTradeRequest: function(friend) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_SEND_TRADE_REQUEST,
      friend: friend
    });
  },

  purge: function(id) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_PURGE,
      id: id
    });
  }

};

module.exports = FriendsActions;
