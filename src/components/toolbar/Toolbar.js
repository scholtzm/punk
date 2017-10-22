const React = require('react');

const UIActions = require('../../actions/ui-actions.js');
const UserStore = require('../../stores/user-store.js');

const SteamCommunityWindow = require('../../ui/windows/steam-community.js');

const CurrentUser = require('./CurrentUser.js');
const UpdateNotification = require('./UpdateNotification.js');
const PendingTradeOffers = require('./PendingTradeOffers.js');
const Notifications = require('./Notifications.js');

class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: UserStore.get()
    };

    this._onChange = this._onChange.bind(this);
  }

  _onChange() {
    this.setState({ user: UserStore.get() });
  }

  _onLogout() {
    UIActions.logout();
  }

  _onAddFriend() {
    UIActions.addFriendOpenDialog();
  }

  _onOpenStore() {
    SteamCommunityWindow.open('https://store.steampowered.com');
  }

  _onOpenProfile() {
    SteamCommunityWindow.open('https://steamcommunity.com/my/');
  }

  componentDidMount() {
    UserStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
  }

  render() {
    return (
      <div className="toolbar-actions">
        <CurrentUser user={this.state.user}/>

        <div className="btn-group" title="Add a friend">
          <button className="btn btn-default" onClick={(e) => this._onAddFriend(e)}>
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
          <button className="btn btn-default" title="Store" onClick={(e) => this._onOpenStore(e)}>
            <i className="fa fa-shopping-cart"></i>
          </button>
          <button className="btn btn-default" title="Profile" onClick={(e) => this._onOpenProfile(e)}>
            <i className="fa fa-user"></i>
          </button>
        </div>

        <button className="btn btn-default pull-right" title="Logout" onClick={(e) => this._onLogout(e)}>
          <i className="fa fa-sign-out"></i>
        </button>

        <UpdateNotification />
      </div>
    );
  }
};

module.exports = Toolbar;
