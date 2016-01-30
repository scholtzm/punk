var remote = require('remote');

var React = require('react');
var classNames = require('classnames');

var ChatActions = require('../actions/chat-actions.js');
var FriendsStore = require('../stores/friends-store.js');
var Constants = require('../constants');

var ENTER_KEY = 13;

var FriendsListItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  _getOnlineStateClassName: function() {
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

  _getRelationshipStateClassName: function() {
    return 'relationship-' + this.props.user.relationshipEnum;
  },

  _onDoubleClick: function(event) {
    event.preventDefault();
    if(this.props.user.relationshipEnum === Constants.SteamEnums.EFriendRelationship.Friend) {
      ChatActions.openChat(this.props.user);
    }
  },

  _onContextMenu: function(event) {
    event.preventDefault();
    var menu = require('../ui/menus/friends-menu.js')(this.props.user);
    menu.popup(remote.getCurrentWindow());
  },

  render: function() {
    var classNameItem = classNames('list-group-item', this._getRelationshipStateClassName());
    var classNameAvatar = classNames('img-circle', 'media-object', 'pull-left', this._getOnlineStateClassName());

    return (
      <li className={classNameItem} onDoubleClick={this._onDoubleClick} onContextMenu={this._onContextMenu}>
        <img className={classNameAvatar} src={this.props.user.avatar} width="32" height="32" />
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
    var newFriends = FriendsStore.getAllSorted();
    var newState = this.state;

    newState.friends = newFriends;
    this.setState(newState);
  },

  _onSearch: function(event) {
    var newSearchTerm = event.target.value.trim();
    var newState = this.state;

    newState.searchTerm = newSearchTerm;
    this.setState(newState);
  },

  _onSearchSubmit: function(event) {
    if(event.keyCode === ENTER_KEY) {
      var firstFriend = this._firstUserThatMatchesSearchTerm();
      ChatActions.openChat(firstFriend);

      var newState = this.state;
      newState.searchTerm = '';
      this.setState(newState);
    }
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

  _firstUserThatMatchesSearchTerm: function() {
    var friends = this.state.friends;

    for(var id in friends) {
      if(this._userMatchesSearchTerm(friends[id])) {
        return friends[id];
      }
    }
  },

  getInitialState: function() {
    return {
      friends: FriendsStore.getAllSorted(),
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
            onChange={this._onSearch}
            onKeyDown={this._onSearchSubmit} />
        </li>
        {self.state.friends.map(function(friend) {
          if(self._userMatchesSearchTerm(friend)) {
            return <FriendsListItem key={friend.id} user={friend} />;
          }
        })}
      </ul>
    );
  }
});

module.exports = FriendsList;
