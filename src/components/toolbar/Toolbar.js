var React = require('react');

var UIActions = require('../../actions/ui-actions.js');
var UserStore = require('../../stores/user-store.js');

var SteamCommunityWindow = require('../../ui/windows/steam-community.js');

var CurrentUser = require('./CurrentUser.js');
const UpdateNotification = require('./UpdateNotification.js');
var PendingTradeOffers = require('./PendingTradeOffers.js');
var Notifications = require('./Notifications.js');

var Toolbar = React.createClass({
  _onChange: function() {
    this.setState({ user: UserStore.get() });
  },

  _onLogout: function() {
    UIActions.logout();
  },

  _onAddFriend: function() {
    UIActions.addFriendOpenDialog();
  },

  _onOpenStore: function() {
    SteamCommunityWindow.open('https://store.steampowered.com');
  },

  _onOpenProfile: function() {
    SteamCommunityWindow.open('https://steamcommunity.com/my/');
  },

  getInitialState: function() {
    return {
      user: UserStore.get()
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div className="toolbar-actions">
        <CurrentUser user={this.state.user}/>

        <div className="btn-group" title="Add a friend">
          <button className="btn btn-default" onClick={this._onAddFriend}>
            <i className="fa fa-user-plus"></i>
          </button>
          <button className="btn btn-default" title="Not implemented yet">
            <i className="fa fa-cog"></i>
          </button>
        </div>

        <div className="btn-group">
          <PendingTradeOffers />
          <Notifications />
        </div>

        <div className="btn-group">
          <button className="btn btn-default" title="Store" onClick={this._onOpenStore}>
            <i className="fa fa-shopping-cart"></i>
          </button>
          <button className="btn btn-default" title="Profile" onClick={this._onOpenProfile}>
            <i className="fa fa-user"></i>
          </button>
        </div>

        <button className="btn btn-default pull-right" title="Logout" onClick={this._onLogout}>
          <i className="fa fa-sign-out"></i>
        </button>

        <UpdateNotification />
      </div>
    );
  }
});

module.exports = Toolbar;
