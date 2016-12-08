var remote = require('electron').remote;

var React = require('react');

var NotificationStore = require('../../stores/notification-store.js');

var Notifications = React.createClass({
  _onClick: function() {
    var menu = require('../../ui/menus/notifications-menu.js')(this.state.notifications);
    menu.popup(remote.getCurrentWindow());
  },

  _onChange: function() {
    this.setState({ notifications: NotificationStore.get() });
  },

  getInitialState: function() {
    return {
      notifications: NotificationStore.get()
    };
  },

  componentDidMount: function() {
    NotificationStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    NotificationStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var count = this.state.notifications.comments +
      this.state.notifications.items +
      this.state.notifications.invites +
      this.state.notifications.messages;
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
