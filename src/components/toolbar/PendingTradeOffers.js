const React = require('react');

const NotificationStore = require('../../stores/notification-store.js');
const SteamCommunityWindow = require('../../ui/windows/steam-community.js');

class PendingTradeOffers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: NotificationStore.get()
    };

    this._onChange = this._onChange.bind(this);
  }

  _onClick() {
    SteamCommunityWindow.open('https://steamcommunity.com/my/tradeoffers/');
  }

  _onChange() {
    this.setState({ notifications: NotificationStore.get() });
  }

  componentDidMount() {
    NotificationStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    NotificationStore.removeChangeListener(this._onChange);
  }

  render() {
    const tradeOffers = this.state.notifications.tradeOffers;
    let badge = <span/>;

    if(tradeOffers && tradeOffers > 0) {
      badge = <span className="badge">{tradeOffers}</span>;
    }

    return (
      <button className="btn btn-default" title="Pending trade offers" onClick={(e) => this._onClick(e)}>
        <i className="fa fa-exchange"></i>
        {badge}
      </button>
    );
  }
};

module.exports = PendingTradeOffers;
