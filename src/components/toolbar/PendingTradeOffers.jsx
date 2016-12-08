var React = require('react');

var NotificationStore = require('../../stores/notification-store.js');
var SteamCommunityWindow = require('../../ui/windows/steam-community.js');

var PendingTradeOffers = React.createClass({
  _onClick: function() {
    SteamCommunityWindow.open('https://steamcommunity.com/my/tradeoffers/');
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
    var tradeOffers = this.state.notifications.tradeOffers;
    var badge = <span/>;

    if(tradeOffers && tradeOffers > 0) {
      badge = <span className="badge">{tradeOffers}</span>;
    }

    return (
      <button className="btn btn-default" title="Pending trade offers" onClick={this._onClick}>
        <i className="fa fa-exchange"></i>
        {badge}
      </button>
    );
  }
});

module.exports = PendingTradeOffers;
