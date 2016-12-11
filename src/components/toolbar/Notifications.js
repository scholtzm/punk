var remote = require('electron').remote;

var React = require('react');
const omit = require('lodash.omit');

var NotificationStore = require('../../stores/notification-store.js');

var Notifications = React.createClass({
  // NOTE: We don't need trade offer notifications since those have a dedicated button.
  _getNotifications: function() {
    return omit(NotificationStore.get(), 'tradeOffers');
  },

  _onClick: function() {
    var menu = require('../../ui/menus/notifications-menu.js')(this.state.notifications);
    menu.popup(remote.getCurrentWindow());
  },

  _onChange: function() {
    this.setState({ notifications: this._getNotifications() });
  },

  getInitialState: function() {
    return {
      notifications: this._getNotifications()
    };
  },

  componentDidMount: function() {
    NotificationStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    NotificationStore.removeChangeListener(this._onChange);
  },

  render: function() {
    const count = Object.keys(this.state.notifications)
      .map(key => this.state.notifications[key])
      .reduce((a, b) => a + b, 0);

    var badge = <span/>;

    if(count && count > 0) {
      badge = <span className="badge">{count}</span>;
    }

    return (
      <button className="btn btn-default" title="Steam notifications" onClick={this._onClick}>
        <i className="fa fa-envelope-o"></i>
        {badge}
      </button>
    );
  }
});

module.exports = Notifications;
