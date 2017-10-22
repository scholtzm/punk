const remote = require('electron').remote;

const React = require('react');
const omit = require('lodash.omit');

const NotificationStore = require('../../stores/notification-store.js');

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state= {
      notifications: this._getNotifications()
    };

    this._onChange = this._onChange.bind(this);
  }

  // NOTE: We don't need trade offer notifications since those have a dedicated button.
  _getNotifications() {
    return omit(NotificationStore.get(), 'tradeOffers');
  }

  _onClick() {
    const menu = require('../../ui/menus/notifications-menu.js')(this.state.notifications);
    menu.popup(remote.getCurrentWindow());
  }

  _onChange() {
    this.setState({ notifications: this._getNotifications() });
  }

  componentDidMount() {
    NotificationStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    NotificationStore.removeChangeListener(this._onChange);
  }

  render() {
    const count = Object.keys(this.state.notifications)
      .map(key => this.state.notifications[key])
      .reduce((a, b) => a + b, 0);

    let badge = <span/>;

    if(count && count > 0) {
      badge = <span className="badge">{count}</span>;
    }

    return (
      <button className="btn btn-default" title="Steam notifications" onClick={(e) => this._onClick(e)}>
        <i className="fa fa-envelope-o"></i>
        {badge}
      </button>
    );
  }
};

module.exports = Notifications;
