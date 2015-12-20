var Dispatcher = require('../dispatcher');
var Constants = require('../constants');

var FriendsActions = {

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

  add: function(id) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_ADD,
      id: id
    });
  }

};

module.exports = FriendsActions;
