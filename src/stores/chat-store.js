var Dispatcher = require('../dispatcher');
var Constants = require('../constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _chats = {};

function newFriendMessage(message) {
  if(!_chats[message.sender]) {
    _chats[message.sender] = {};
    _chats[message.sender].messages = [];
    _chats[message.sender].visible = false;
  }

  _chats[message.sender].name = message.name;
  _chats[message.sender].messages.push(message.text);

  if(Object.keys(_chats).length === 1) {
    _chats[message.sender].visible = true;
  }
}

var ChatStore = assign({}, EventEmitter.prototype, {

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
    return _chats[id];
  },

  getAll: function() {
    return _chats;
  },

  getVisible: function() {
    for(var id in _chats) {
      if(_chats[id].visible) {
        return _chats[id];
      }
    }
  }

});

ChatStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case Constants.CHAT_NEW_FRIEND_MESSAGE:
      newFriendMessage(action.message);
      ChatStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = ChatStore;
