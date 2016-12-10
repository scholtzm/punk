const React = require('react');

const UIStore = require('../../stores/ui-store.js');
const urlHelper = require('../../utils/url-helper.js');

const UpdateNotification = React.createClass({
  _onChange: function() {
    this.setState({ isUpdateAvailable: UIStore.get().isUpdateAvailable });
  },

  _onClick: function() {
    // TODO: Move all URLs to some config
    urlHelper.openExternal('http://github.com/scholtzm/punk/releases');
  },

  getInitialState: function() {
    return { isUpdateAvailable: UIStore.get().isUpdateAvailable };
  },

  componentDidMount: function() {
    UIStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UIStore.removeChangeListener(this._onChange);
  },

  render: function() {
    if(!this.state.isUpdateAvailable) {
      return null;
    }

    return (
      <button className="btn btn-default pull-right" title="Update available" onClick={this._onClick}>
        <i className="fa fa-rocket"></i> Update available
      </button>
    );
  }
});

module.exports = UpdateNotification;
