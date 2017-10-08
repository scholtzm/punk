const { EventEmitter } = require('events');
const shortid = require('shortid');
const remote = require('electron').remote;

const Dispatcher = require('../dispatcher');
const Constants = require('../constants');
const notifier = require('../ui/notifier');

const CHANGE_EVENT = 'change';

let _chats = {};

function _createChat(id) {
  if(!_chats[id]) {
    _chats[id] = {};
    _chats[id].id = id;
    _chats[id].messages = [];
    _chats[id].visible = false;
    _chats[id].unreadMessageCount = 0;
    _chats[id].typing = false;
  }
}

function _createChatMessage(id, message) {
  _chats[id].tabbed = true;

  if(message.username) {
    _chats[id].username = message.username;
  }

  _chats[id].messages.push({
    id: shortid.generate(), // each message gets unique ID
    type: message.type,
    date: message.date,
    text: message.text,
    meta: message.meta
  });
}

function _resetUnreadMessageCount(id) {
  _chats[id].unreadMessageCount = 0;
}

function _findVisibleChat() {
  for(const id in _chats) {
    if(_chats[id].visible) {
      return _chats[id];
    }
  }
}

function _toggleVisibleChat(id) {
  const currentVisibleChat = _findVisibleChat();
  if(currentVisibleChat) {
    currentVisibleChat.visible = false;
  }

  if(id) {
    _chats[id].visible = true;
  }
}

function _findFirstToMakeVisible(cannotBeMadeVisibleId) {
  for(const id in _chats) {
    if(id !== cannotBeMadeVisibleId && _chats[id].tabbed) {
      return _chats[id];
    }
  }
}

function _invalidateTradeRequests(id) {
  if(!_chats[id]) {
    return;
  }

  _chats[id].messages.forEach((message) => {
    if(message.meta && message.meta.tradeRequestId && !message.meta.response) {
      message.meta.response = 'Invalid';
    }
  });
}

function _getLastTradeRequest(id, ourRequestsOnly) {
  ourRequestsOnly = ourRequestsOnly || false;

  const tradeRequests = _chats[id].messages.filter((message) => {
    if(message.type === Constants.MessageTypes.CHAT_OUR_TRADE_REQUEST) {
      return true;
    }

    if(message.type === Constants.MessageTypes.CHAT_THEIR_TRADE_REQUEST && !ourRequestsOnly) {
      return true;
    }

    return false;
  });

  if(tradeRequests.length > 0) {
    return tradeRequests[tradeRequests.length - 1];
  }
}

function _getTradeRequestById(userId, tradeRequestId) {
  const messages = _chats[userId].messages.filter((message) => {
    if(message.meta && message.meta.tradeRequestId === tradeRequestId) {
      return true;
    }
    return false;
  });

  // this should always match only a single trade request (message)
  if(messages.length > 0) {
    return messages[0];
  }
}

function openChat(user) {
  const id = user.id;
  const username = user.username;

  _createChat(id);
  _toggleVisibleChat(id);
  _resetUnreadMessageCount(id);

  _chats[id].username = username;
  _chats[id].tabbed = true;
}

function switchChat(chat) {
  const id = chat.id;

  _toggleVisibleChat(id);
  _resetUnreadMessageCount(id);
}

function closeChat(chat) {
  const id = chat.id;

  _chats[id].tabbed = false;

  if(_chats[id].visible) {
    _chats[id].visible = false;

    const toBeMadeVisible = _findFirstToMakeVisible(id);
    if(toBeMadeVisible) {
      toBeMadeVisible.visible = true;
      _resetUnreadMessageCount(toBeMadeVisible.id);
    }
  }
};

function clearChat(chat) {
  const id = chat.id;

  if(_chats[id]) {
    _chats[id].messages = [];
  }
}

function newIncomingMessage(message) {
  _createChat(message.sender);
  _createChatMessage(message.sender, message);

  const currentChat = _chats[message.sender];

  // make visible if necessary
  const currentVisibleChat = _findVisibleChat();
  if(!currentVisibleChat) {
    currentChat.visible = true;
  }

  // increase unread count if necessary
  if(!currentChat.visible) {
    currentChat.unreadMessageCount++;
  }

  // mark as not typing
  currentChat.typing = false;

  // notify user if needed
  if(!currentChat.visible || !remote.getCurrentWindow().isFocused()) {
    notifier.message({
      username: message.username,
      text: message.text,
      chat: currentChat,
      playSound: true
    });
  }

  // flash the window if it has no focus
  if(!remote.getCurrentWindow().isFocused()) {
    notifier.flash('informational');
  }
}

function newOutgoingMessage(message) {
  _createChat(message.target);
  _createChatMessage(message.target, message);

  // make visible if necessary
  const currentVisibleChat = _findVisibleChat();
  if(!currentVisibleChat) {
    _chats[message.target].visible = true;
  }
}

function respondToTradeRequest(chat, message, response) {
  _invalidateTradeRequests(chat.id);

  message.meta.response = response ? 'Accepted' : 'Declined';
}

function incomingTradeRequestResponse(response) {
  _invalidateTradeRequests(response.id);

  if(response.tradeRequestId === 0) {
    // assume this concerns the very last trade request
    const message = _getLastTradeRequest(response.id);
    if(message) {
      message.meta.response = response.responseEnum;
    }
  } else {
    const messageById = _getTradeRequestById(response.id, response.tradeRequestId);

    if(messageById) {
      messageById.meta.response = response.responseEnum;
    } else {
      // trade request ID did not match, this is probably a trade request which we sent
      const messageLastTradeReq = _getLastTradeRequest(response.id, true);
      if(messageLastTradeReq) {
        messageLastTradeReq.meta.response = response.responseEnum;
      }
    }
  }
}

function remove(id) {
  if(!_chats[id]) {
    return;
  }

  if(_chats[id].visible) {
    _chats[id].visible = false;

    const toBeMadeVisible = _findFirstToMakeVisible(id);
    if(toBeMadeVisible) {
      toBeMadeVisible.visible = true;
      _resetUnreadMessageCount(toBeMadeVisible.id);
    }
  }

  delete _chats[id];
}

function otherUserIsTyping(steamId) {
  if(!_chats[steamId]) {
    return;
  }

  _chats[steamId].typing = true;
}

function otherUserStoppedTyping(steamId) {
  if(!_chats[steamId]) {
    return;
  }

  _chats[steamId].typing = false;
}

function clear() {
  _chats = {};
}

class ChatStore extends EventEmitter {

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  get(id) {
    return _chats[id];
  }

  getAll() {
    return _chats;
  }

  getVisible() {
    for(const id in _chats) {
      if(_chats[id].visible) {
        return _chats[id];
      }
    }
  }

  getLastIncomingTradeRequestId(id) {
    const incomingTradeRequests = _chats[id].messages.filter((message) => {
      if(message.type === Constants.MessageTypes.CHAT_THEIR_TRADE_REQUEST && message.meta && message.meta.tradeRequestId) {
        return true;
      }
      return false;
    });

    if(incomingTradeRequests.length > 0) {
      return incomingTradeRequests[incomingTradeRequests.length - 1].meta.tradeRequestId;
    }
  }

};

const chatStore = new ChatStore();

ChatStore.dispatchToken = Dispatcher.register((action) => {
  switch(action.type) {
    case Constants.ChatActions.CHAT_OPEN:
      openChat(action.user);
      chatStore.emitChange();
      break;

    case Constants.ChatActions.CHAT_SWITCH:
      switchChat(action.chat);
      chatStore.emitChange();
      break;

    case Constants.ChatActions.CHAT_CLOSE:
      closeChat(action.chat);
      chatStore.emitChange();
      break;

    case Constants.ChatActions.CHAT_CLEAR:
      clearChat(action.chat);
      chatStore.emitChange();
      break;

    case Constants.ChatActions.CHAT_NEW_INCOMING_MESSAGE:
      newIncomingMessage(action.message);
      chatStore.emitChange();
      break;

    case Constants.ChatActions.CHAT_NEW_OUTGOING_MESSAGE:
    case Constants.ChatActions.CHAT_ECHO_MESSAGE:
      newOutgoingMessage(action.message);
      chatStore.emitChange();
      break;

    case Constants.ChatActions.CHAT_RESPOND_TO_TRADE_REQUEST:
      respondToTradeRequest(action.chat, action.message, action.response);
      chatStore.emitChange();
      break;

    case Constants.ChatActions.CHAT_INCOMING_TRADE_REQUEST_RESPONSE:
      incomingTradeRequestResponse(action.response);
      chatStore.emitChange();
      break;

    case Constants.ChatActions.OTHER_USER_IS_TYPING:
      otherUserIsTyping(action.steamId);
      chatStore.emitChange();
      break;

    case Constants.ChatActions.OTHER_USER_STOPPED_TYPING:
      otherUserStoppedTyping(action.steamId);
      chatStore.emitChange();
      break;

    case Constants.FriendsActions.FRIENDS_SEND_TRADE_REQUEST:
      const friend = action.friend;

      const message = {
        type: Constants.MessageTypes.CHAT_OUR_TRADE_REQUEST,
        target: friend.id,
        username: friend.username,
        date: new Date(),
        text: `You have sent a trade request to ${ friend.username }.`,
        meta: {}
      };

      newOutgoingMessage(message);
      chatStore.emitChange();
      break;

    case Constants.FriendsActions.FRIENDS_REMOVE:
      remove(action.friend.id);
      chatStore.emitChange();
      break;

    case Constants.FriendsActions.FRIENDS_PURGE:
      remove(action.id);
      chatStore.emitChange();
      break;

    case Constants.UIActions.UI_LOGOUT:
      clear();
      chatStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = chatStore;
