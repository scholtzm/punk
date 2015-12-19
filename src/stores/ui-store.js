var Dispatcher = require('../dispatcher');
var Constants = require('../constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _state = {
  isChangeNameDialogOpen: false,
  isAddFriendDialogOpen: false
};

function set(key, value) {
  _state[key] = value;
}

var UIStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get: function() {
    return _state;
  }

});

UIStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case Constants.UIActions.CHANGE_NAME_OPEN_DIALOG:
      set('isChangeNameDialogOpen', true);
      UIStore.emitChange();
      break;

    case Constants.UIActions.CHANGE_NAME_CLOSE_DIALOG:
      set('isChangeNameDialogOpen', false);
      UIStore.emitChange();
      break;

    case Constants.UIActions.ADD_FRIEND_OPEN_DIALOG:
      set('isAddFriendDialogOpen', true);
      UIStore.emitChange();
      break;

    case Constants.UIActions.ADD_FRIEND_CLOSE_DIALOG:
      set('isAddFriendDialogOpen', false);
      UIStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = UIStore;
