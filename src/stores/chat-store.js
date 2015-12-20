var Dispatcher = require('../dispatcher');
var Constants = require('../constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _chats = {};

function _findVisibleChat() {
  for(var id in _chats) {
    if(_chats[id].visible) {
      return _chats[id];
    }
  }
}

function _toggleVisibleChat() {
  var currentVisibleChat = _findVisibleChat();
  if(currentVisibleChat) {
    currentVisibleChat.visible = false;
  }
}

function _findFirstToMakeVisible(cannotBeMadeVisibleId) {
  for(var id in _chats) {
    if(id !== cannotBeMadeVisibleId && _chats[id].tabbed) {
      return _chats[id];
    }
  }
}

function openChat(user) {
  var id = user.id;
  var username = user.username;

  _toggleVisibleChat();

  if(!_chats[id]) {
    _chats[id] = {};
    _chats[id].id = id;
    _chats[id].messages = [];
  }

  _chats[id].username = username;
  _chats[id].visible = true;
  _chats[id].tabbed = true;
}

function switchChat(chat) {
  var id = chat.id;

  _toggleVisibleChat();

  _chats[id].visible = true;
}

function closeChat(chat) {
  var id = chat.id;

  _chats[id].tabbed = false;

  if(_chats[id].visible) {
    _chats[id].visible = false;

    var toBeMadeVisible = _findFirstToMakeVisible(id);
    if(toBeMadeVisible) {
      toBeMadeVisible.visible = true;
    }
  }
};

function clearChat(chat) {
  var id = chat.id;

  if(_chats[id]) {
    _chats[id].messages = [];
  }
}

function newIncomingMessage(message) {
  if(!_chats[message.sender]) {
    _chats[message.sender] = {};
    _chats[message.sender].id = message.sender;
    _chats[message.sender].messages = [];
    _chats[message.sender].visible = false;
  }

  _chats[message.sender].tabbed = true;
  _chats[message.sender].username = message.username;
  _chats[message.sender].messages.push({
    type: Constants.MessageTypes.CHAT_THEIR_MESSAGE,
    date: new Date(),
    text: message.text
  });

  if(Object.keys(_chats).length === 1) {
    _chats[message.sender].visible = true;
  }
}

function newOutgoingMessage(message) {
  // chat must exist at this point
  if(!_chats[message.target]) {
    return;
  }

  _chats[message.target].messages.push({
    type: Constants.MessageTypes.CHAT_OUR_MESSAGE,
    date: new Date(),
    text: message.text
  });
}

function remove(id) {
  if(!_chats[id]) {
    return;
  }

  if(_chats[id].visible) {
    _chats[id].visible = false;

    var toBeMadeVisible = _findFirstToMakeVisible(id);
    if(toBeMadeVisible) {
      toBeMadeVisible.visible = true;
    }
  }

  delete _chats[id];
}

function clear() {
  _chats = {};
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
    case Constants.ChatActions.CHAT_OPEN:
      openChat(action.user);
      ChatStore.emitChange();
      break;

    case Constants.ChatActions.CHAT_SWITCH:
      switchChat(action.chat);
      ChatStore.emitChange();
      break;

    case Constants.ChatActions.CHAT_CLOSE:
      closeChat(action.chat);
      ChatStore.emitChange();
      break;

    case Constants.ChatActions.CHAT_CLEAR:
      clearChat(action.chat);
      ChatStore.emitChange();
      break;

    case Constants.ChatActions.CHAT_NEW_INCOMING_MESSAGE:
      newIncomingMessage(action.message);
      ChatStore.emitChange();
      break;

    case Constants.ChatActions.CHAT_NEW_OUTGOING_MESSAGE:
      newOutgoingMessage(action.message);
      ChatStore.emitChange();
      break;

    case Constants.FriendsActions.FRIENDS_REMOVE:
      remove(action.friend.id);
      ChatStore.emitChange();
      break;

    case Constants.UIActions.UI_LOGOUT:
      clear();
      ChatStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = ChatStore;
