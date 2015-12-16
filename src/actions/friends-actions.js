var Dispatcher = require('../dispatcher');
var Constants = require('../constants');

var FriendsActions = {

  insertOrUpdate: function(friend) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.FRIENDS_INSERT_OR_UPDATE,
      friend: friend
    });
  },

  remove: function(friend) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.REMOVE,
      friend: friend
    });
  },

  block: function(friend) {
    Dispatcher.dispatch({
      type: Constants.FriendsActions.BLOCK,
      friend: friend
    });
  }

};

module.exports = FriendsActions;
