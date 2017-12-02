const React = require('react');

const UIActions = require('../../actions/ui-actions.js');
const FriendsActions = require('../../actions/friends-actions.js');
const UIStore = require('../../stores/ui-store.js');

const ENTER_KEY = 13;

class AddFriendDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uiState: UIStore.get(),
      friendId: ''
    };

    this._onChange = this._onChange.bind(this);
  }

  _onChange() {
    this.setState({ uiState: UIStore.get() });
  }

  _onFriendIdChange(event) {
    this.setState({ friendId: event.target.value });
  }

  _onCancel() {
    UIActions.addFriendCloseDialog();
  }

  _onSubmit(event) {
    if(event.keyCode === ENTER_KEY) {
      this._onSave();
    }
  }

  _onSave() {
    const id = this.state.friendId.trim();

    if(id !== '') {
      FriendsActions.add(id);
      UIActions.addFriendCloseDialog();

      this.setState({ displayName: '' });
    }
  }

  componentDidMount() {
    UIStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    UIStore.removeChangeListener(this._onChange);
  }

  componentDidUpdate() {
    if(this._friendId) {
      this._friendId.focus();
    }
  }

  render() {
    if(!this.state.uiState.isAddFriendDialogOpen) {
      return null;
    }

    return (
      <dialog open>
        <header className="toolbar toolbar-header">
            <h1 className="title">Add friend</h1>
        </header>

        <div className="content">
            <input
              type="text"
              className="form-control"
              placeholder="SteamID64"
              ref={(c) => {
                this._friendId = c; 
              }}
              value={this.state.friendId}
              onChange={(e) => this._onFriendIdChange(e)} />
        </div>

        <footer className="toolbar toolbar-footer">
            <div className="toolbar-actions">
                <button className="btn btn-default" onClick={(e) => this._onCancel(e)}>Cancel</button>
                <button className="btn btn-primary pull-right" onClick={(e) => this._onSave(e)}>Save</button>
            </div>
        </footer>
      </dialog>
    );
  }
};

module.exports = AddFriendDialog;
