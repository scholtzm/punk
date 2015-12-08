var Dispatcher = require('../dispatcher');
var Constants = require('../constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _friends = {};

function insertOrUpdate(friend) {
  _friends[friend.id] = friend;
}

var FriendsStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get: function(id) {
    return _friends[id];
  },

  getAll: function() {
    return _friends;
  }

});

FriendsStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case Constants.FRIENDS_UPDATE_OR_INSERT:
      insertOrUpdate(action.friend);
      FriendsStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = FriendsStore;
