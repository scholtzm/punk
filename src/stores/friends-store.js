var Dispatcher = require('../dispatcher');
var Constants = require('../constants');
var notifier = require('../ui/notifier');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _friends = [];

function init(friends) {
  _friends = friends;
}

function insertOrUpdate(friend) {
  var existingIndex = getIndexById(friend.id);

  if(existingIndex !== undefined) {
    _friends[existingIndex] = friend;
  } else {
    _friends.push(friend);

    if(friend.relationshipEnum === Constants.SteamEnums.EFriendRelationship.RequestRecipient) {
      notifier.friend();
    }
  }
}

function remove(id) {
  var existingIndex = getIndexById(id);

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
      return _friends[existingIndex];
    }
  },

  getAll: function() {
    return _friends;
  },

  // this is probably slow af
  // perhaps prioritized sorting might be faster
  getAllSorted: function() {
    _friends = _friends.sort(function(a, b) {
      if(a.relationshipEnum < b.relationshipEnum) {
        return -1;
      } else if(a.relationshipEnum > b.relationshipEnum) {
        return 1;
      }

      if(a.inGame && b.inGame) {
        return a.username.localeCompare(b.username);
      } else if(a.inGame) {
        return -1;
      } else if(b.inGame) {
        return 1;
      }

      if(a.stateEnum !== 0 && b.stateEnum !== 0) {
        return a.username.localeCompare(b.username);
      } else if(a.stateEnum !== 0) {
        return -1;
      } else if(b.stateEnum !== 0){
        return 1;
      }

      return a.username.localeCompare(b.username);
    });
    return _friends;
  }

});

FriendsStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case Constants.FriendsActions.FRIENDS_INIT:
      init(action.friends);
      FriendsStore.emitChange();
      break;

    case Constants.FriendsActions.FRIENDS_INSERT_OR_UPDATE:
      insertOrUpdate(action.friend);
      FriendsStore.emitChange();
      break;

    case Constants.FriendsActions.FRIENDS_REMOVE:
      remove(action.friend.id);
      FriendsStore.emitChange();
      break;

    case Constants.FriendsActions.FRIENDS_PURGE:
      remove(action.id);
      FriendsStore.emitChange();
      break;

    case Constants.UIActions.UI_LOGOUT:
      clear();
      FriendsStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = FriendsStore;
