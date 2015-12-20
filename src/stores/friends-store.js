var Dispatcher = require('../dispatcher');
var Constants = require('../constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _friends = [];

function insertOrUpdate(friend) {
  var existingIndex = getIndexById(friend.id);

  if(existingIndex !== undefined) {
    _friends[existingIndex] = friend;
  } else {
    _friends.push(friend);
  }
}

function remove(friend) {
  var existingIndex = getIndexById(friend.id);

  if(existingIndex !== undefined) {
    _friends.splice(existingIndex, 1);
  }
}

function clear() {
  _friends = [];
}

function getIndexById(id) {
  for(var i = 0; i < _friends.length; i++) {
    if(_friends[i].id === id) {
      // returns number >= 0
      return i;
    }
  }
  // returns undefined if no match
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

  getByIndex: function(index) {
    return _friends[index];
  },

  getById: function(id) {
    var existingIndex = getIndexById(id);

    if(existingIndex !== undefined) {
      _friends[existingIndex];
    }
  },

  getAll: function() {
    return _friends;
  }

});

FriendsStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case Constants.FriendsActions.FRIENDS_INSERT_OR_UPDATE:
      insertOrUpdate(action.friend);
      FriendsStore.emitChange();
      break;

    case Constants.FriendsActions.REMOVE:
      remove(action.friend);
      FriendsStore.emitChange();
      break;

    case Constants.UIActions.LOGOUT:
      clear();
      FriendsStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = FriendsStore;
