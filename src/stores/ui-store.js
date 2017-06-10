const Dispatcher = require('../dispatcher');
const Constants = require('../constants');
const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');

const CHANGE_EVENT = 'change';

const _state = {
  isChangeNameDialogOpen: false,
  isAddFriendDialogOpen: false,
  isUpdateAvailable: false
};

function set(key, value) {
  _state[key] = value;
}

const UIStore = assign({}, EventEmitter.prototype, {

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

UIStore.dispatchToken = Dispatcher.register((action) => {
  switch(action.type) {
    case Constants.UIActions.UI_CHANGE_NAME_OPEN_DIALOG:
      set('isChangeNameDialogOpen', true);
      UIStore.emitChange();
      break;

    case Constants.UIActions.UI_CHANGE_NAME_CLOSE_DIALOG:
      set('isChangeNameDialogOpen', false);
      UIStore.emitChange();
      break;

    case Constants.UIActions.UI_ADD_FRIEND_OPEN_DIALOG:
      set('isAddFriendDialogOpen', true);
      UIStore.emitChange();
      break;

    case Constants.UIActions.UI_ADD_FRIEND_CLOSE_DIALOG:
      set('isAddFriendDialogOpen', false);
      UIStore.emitChange();
      break;

    case Constants.UIActions.UI_UPDATE_AVAILABLE:
      set('isUpdateAvailable', true);
      UIStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = UIStore;
