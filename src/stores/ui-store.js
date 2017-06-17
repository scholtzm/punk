const { EventEmitter } = require('events');

const Dispatcher = require('../dispatcher');
const Constants = require('../constants');

const CHANGE_EVENT = 'change';

const _state = {
  isChangeNameDialogOpen: false,
  isAddFriendDialogOpen: false,
  isUpdateAvailable: false
};

function set(key, value) {
  _state[key] = value;
}

class UIStore extends EventEmitter {

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  get() {
    return _state;
  }

};

const uiStore = new UIStore();

UIStore.dispatchToken = Dispatcher.register((action) => {
  switch(action.type) {
    case Constants.UIActions.UI_CHANGE_NAME_OPEN_DIALOG:
      set('isChangeNameDialogOpen', true);
      uiStore.emitChange();
      break;

    case Constants.UIActions.UI_CHANGE_NAME_CLOSE_DIALOG:
      set('isChangeNameDialogOpen', false);
      uiStore.emitChange();
      break;

    case Constants.UIActions.UI_ADD_FRIEND_OPEN_DIALOG:
      set('isAddFriendDialogOpen', true);
      uiStore.emitChange();
      break;

    case Constants.UIActions.UI_ADD_FRIEND_CLOSE_DIALOG:
      set('isAddFriendDialogOpen', false);
      uiStore.emitChange();
      break;

    case Constants.UIActions.UI_UPDATE_AVAILABLE:
      set('isUpdateAvailable', true);
      uiStore.emitChange();
      break;

    default:
      // ignore
  }
});

module.exports = uiStore;;
