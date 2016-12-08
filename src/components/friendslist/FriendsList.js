var React = require('react');

var ChatActions = require('../../actions/chat-actions.js');
var FriendsStore = require('../../stores/friends-store.js');

var FriendsListItem = require('./FriendsListItem.js');

var ENTER_KEY = 13;

var FriendsList = React.createClass({
  _onChange: function() {
    this.setState({ friends: FriendsStore.getAllSorted() });
  },

  _onSearch: function(event) {
    this.setState({ searchTerm: event.target.value.trim() });
  },

  _onSearchSubmit: function(event) {
    if(event.keyCode === ENTER_KEY) {
      event.preventDefault();

      var firstFriend = this._firstUserThatMatchesSearchTerm();

      if(firstFriend) {
        ChatActions.openChat(firstFriend);
        this.setState({ searchTerm: '' });
      }
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
