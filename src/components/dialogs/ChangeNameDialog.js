const React = require('react');

const UIActions = require('../../actions/ui-actions.js');
const UserActions = require('../../actions/user-actions.js');
const UIStore = require('../../stores/ui-store.js');
const UserStore = require('../../stores/user-store.js');

const ENTER_KEY = 13;

class ChangeNameDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uiState: UIStore.get(),
      displayName: ''
    };

    this._onChange = this._onChange.bind(this);
  }

  _onChange() {
    this.setState({
      uiState: UIStore.get(),
      displayName: UserStore.get().username || ''
    });

    if(this._displayName) {
      this._displayName.focus();
      this._displayName.select();
    }
  }

  _onDisplayNameChange(event) {
    this.setState({ displayName: event.target.value });
  }

  _onCancel() {
    UIActions.changeNameCloseDialog();
  }

  _onSubmit(event) {
    if(event.keyCode === ENTER_KEY) {
      this._onSave();
    }
  }

  _onSave() {
    const name = this.state.displayName.trim();

    if(name !== '') {
      UserActions.changeName(name);
      UIActions.changeNameCloseDialog();
    }
  }

  componentDidMount() {
    UIStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    UIStore.removeChangeListener(this._onChange);
  }

  render() {
    if(!this.state.uiState.isChangeNameDialogOpen) {
      return null;
    }

    return (
      <dialog open>
        <header className="toolbar toolbar-header">
            <h1 className="title">Change your display name</h1>
        </header>

        <div className="content">
            <input
              type="text"
              className="form-control"
              ref={(c) => {
                this._displayName = c; 
              }}
              value={this.state.displayName}
              onChange={(e) => this._onDisplayNameChange(e)}
              onKeyDown={(e) => this._onSubmit(e)} />
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

module.exports = ChangeNameDialog;
