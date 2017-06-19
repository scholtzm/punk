const Dispatcher = require('../dispatcher');
const Constants = require('../constants');

const FriendsActions = {

  init(friends) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_INIT,
      friends
    });
  },

  insertOrUpdate(friend) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_INSERT_OR_UPDATE,
      friend
    });
  },

  remove(friend) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_REMOVE,
      friend
    });
  },

  block(friend) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_BLOCK,
      friend
    });
  },

  unblock(friend) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_UNBLOCK,
      friend
    });
  },

  add(id) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_ADD,
      id
    });
  },

  sendTradeRequest(friend) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_SEND_TRADE_REQUEST,
      friend
    });
  },

  purge(id) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_PURGE,
      id
    });
  }

};

module.exports = FriendsActions;
