var Dispatcher = require('../dispatcher');
var Constants = require('../constants');

var FriendsActions = {

  insertOrUpdate: function(friend) {
    Dispatcher.dispatch({
      type: Constants.FRIENDS_INSERT_OR_UPDATE,
      friend: friend
    });
  }

};

module.exports = FriendsActions;
