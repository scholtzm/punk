var remote = require('remote');

var React = require('react');

var ChatActions = require('../actions/chat-actions.js');
var FriendsStore = require('../stores/friends-store.js');

var FriendsListItem = React.createClass({
  _getClassName: function() {
    if(this.props.user.inGame) {
      return 'in-game-border';
    }

    switch (this.props.user.stateEnum) {
      case 0:
        return 'offline-border';
      default:
        return 'online-border';
    }
  },

  _onDoubleClick: function(event) {
    event.preventDefault();
    ChatActions.openChat(this.props.user);
  },

  _onContextMenu: function(event) {
    event.preventDefault();
    var menu = require('./menus/friends-menu.js')(this.props.user);
    menu.popup(remote.getCurrentWindow());
  },

  render: function() {
    var className = 'img-circle media-object pull-left ' + this._getClassName();

    return (
      <li className="list-group-item" onDoubleClick={this._onDoubleClick} onContextMenu={this._onContextMenu}>
        <img className={className} src={this.props.user.avatar} width="32" height="32" />
        <div className="media-body">
          <strong>{this.props.user.username}</strong>
          <p>{this.props.user.state}</p>
        </div>
      </li>
    );
  }
});

var FriendsList = React.createClass({
  _onChange: function() {
    this.setState({ friends: FriendsStore.getAll() });
  },

  _onSearch: function(event) {
    var newSearchTerm = event.target.value.trim();
    var newState = this.state;

    newState.searchTerm = newSearchTerm;
    this.setState(newState);
  },

  _userMatchesSearchTerm: function(user) {
    var searchTerm = this.state.searchTerm.toLowerCase();
    var username = user.username.toLowerCase();
    var id = user.id.toLowerCase();

    if(username.indexOf(searchTerm) > -1) {
      return true;
    }

    if(id.indexOf(searchTerm) > -1) {
      return true;
    }

    return false;
  },

  getInitialState: function() {
    return {
      friends: FriendsStore.getAll(),
      searchTerm: ''
    };
  },

  componentDidMount: function() {
    FriendsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    FriendsStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var self = this;

    return (
      <ul className="list-group">
        <li className="list-group-header">
          <input
            className="form-control"
            type="text"
            placeholder="Search by name or Steam ID"
            value={this.state.searchTerm}
            onChange={this._onSearch} />
        </li>
        {Object.keys(self.state.friends).map(function(id) {
          if(self._userMatchesSearchTerm(self.state.friends[id])) {
            return <FriendsListItem key={id} user={self.state.friends[id]} />;
          }
        })}
      </ul>
    );
  }
});

module.exports = FriendsList;
