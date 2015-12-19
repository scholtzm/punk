var React = require('react');

var UIActions = require('../../actions/ui-actions.js');
var UserActions = require('../../actions/user-actions.js');
var UIStore = require('../../stores/ui-store.js');

var ChangeNameDialog = React.createClass({
  _onChange: function() {
    var newState = this.state;
    newState.uiState = UIStore.get();

    this.setState(newState);
  },

  _onDisplayNameChange: function(event) {
    var newState = this.state;
    newState.displayName = event.target.value;

    this.setState(newState);
  },

  _onCancel: function() {
    UIActions.changeNameCloseDialog();
  },

  _onSave: function() {
    var name = this.state.displayName.trim();

    if(name !== '') {
      UserActions.changeName(name);
      UIActions.changeNameCloseDialog();
    }
  },

  getInitialState: function() {
    return {
      uiState: UIStore.get(),
      displayName: ''
    };
  },

  componentDidMount: function() {
    UIStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UIStore.removeChangeListener(this._onChange);
  },

  render: function() {
    if(!this.state.uiState.isChangeNameDialogOpen) {
      return <div/>;
    }

    return (
      <dialog open>
        <header className="toolbar toolbar-header">
            <h1 className="title">Change your display name</h1>
        </header>

        <div className="content">
            <input type="text" className="form-control" value={this.state.displayName} onChange={this._onDisplayNameChange} />
        </div>

        <footer className="toolbar toolbar-footer">
            <div className="toolbar-actions">
                <button className="btn btn-default" onClick={this._onCancel}>Cancel</button>
                <button className="btn btn-primary pull-right" onClick={this._onSave}>Save</button>
            </div>
        </footer>
      </dialog>
    );
  }
});

module.exports = ChangeNameDialog;
