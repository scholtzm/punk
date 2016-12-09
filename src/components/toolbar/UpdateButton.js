var React = require('react');

var SettingsStore = require('../../stores/settings-store.js');
const urlHelper = require('../../utils/url-helper.js');

var UpdateButton = React.createClass({
  _onChange: function() {
    this.setState({ updateAvailable: SettingsStore.getUpdateAvailable() });
  },

  _onClick: function() {
    urlHelper.openExternal('http://github.com/scholtzm/punk/releases');
  },

  getInitialState: function() {
    return { updateAvailable: SettingsStore.getUpdateAvailable() };
  },

  componentDidMount: function() {
    SettingsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SettingsStore.removeChangeListener(this._onChange);
  },

  render: function() {
    if(!this.state.updateAvailable) {
      return null;
    }

    return (
      <button className="btn btn-default pull-right" title="Update available" onClick={this._onClick}>
        <i className="fa fa-rocket"></i> Update available
      </button>
    );
  }
});

module.exports = UpdateButton;
