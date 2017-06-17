const { EventEmitter } = require('events');

const Dispatcher = require('../dispatcher');
const Constants = require('../constants');
const notifier = require('../ui/notifier');

const CHANGE_EVENT = 'change';

let _friends = [];

function init(friends) {
  _friends = friends;
}

function insertOrUpdate(friend) {
  const existingIndex = getIndexById(friend.id);

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
  const existingIndex = getIndexById(id);

  if(existingIndex !== undefined) {
    _friends.splice(existingIndex, 1);
  }
}

function clear() {
  _friends = [];
}

function getIndexById(id) {
  for(let i = 0; i < _friends.length; i++) {
    if(_friends[i].id === id) {
      // returns number >= 0
      return i;
    }
  }
  // returns undefined if no match
}

function getById(id) {
  const existingIndex = getIndexById(id);

  if(existingIndex !== undefined) {
    return _friends[existingIndex];
  }
}

function setRelationship(id, relationshipEnum) {
  const friend = getById(id);

  if(friend) {
    friend.relationshipEnum = relationshipEnum;
  }
}

class FriendsStore extends EventEmitter {

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  getByIndex(index) {
    return _friends[index];
  }

  getById(id) {
    return getById(id);
  }

  getAll() {
    return _friends;
  }

  // this is probably slow af
  // perhaps prioritized sorting might be faster
  getAllSorted() {
    _friends = _friends.sort((a, b) => {
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

};

const friendsStore = new FriendsStore();

FriendsStore.dispatchToken = Dispatcher.register((action) => {
  switch(action.type) {
    case Constants.FriendsActions.FRIENDS_INIT:
      init(action.friends);
      friendsStore.emitChange();
      break;

    case Constants.FriendsActions.FRIENDS_INSERT_OR_UPDATE:
      insertOrUpdate(action.friend);
      friendsStore.emitChange();
      break;

    // we have to update this ourselves in case the user is offline when we accept the friend request
    case Constants.FriendsActions.FRIENDS_ADD:
      setRelationship(action.id, Constants.SteamEnums.EFriendRelationship.Friend);
      friendsStore.emitChange();
      break;

    case Constants.FriendsActions.FRIENDS_REMOVE:
      remove(action.friend.id);
      friendsStore.emitChange();
      break;

    case Constants.FriendsActions.FRIENDS_PURGE:
      remove(action.id);
      friendsStore.emitChange();
      break;

    case Constants.UIActions.UI_LOGOUT:
      clear();
      friendsStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = friendsStore;
