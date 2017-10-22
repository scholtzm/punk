const React = require('react');

const ChatActions = require('../../actions/chat-actions.js');
const FriendsStore = require('../../stores/friends-store.js');

const FriendsListItem = require('./FriendsListItem.js');

const ENTER_KEY = 13;

class FriendsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: FriendsStore.getAllSorted(),
      searchTerm: ''
    };

    this._onChange = this._onChange.bind(this);
  }

  _onChange() {
    this.setState({ friends: FriendsStore.getAllSorted() });
  }

  _onSearch(event) {
    this.setState({ searchTerm: event.target.value.trim() });
  }

  _onSearchSubmit(event) {
    if(event.keyCode === ENTER_KEY) {
      event.preventDefault();

      const firstFriend = this._firstUserThatMatchesSearchTerm();

      if(firstFriend) {
        ChatActions.openChat(firstFriend);
        this.setState({ searchTerm: '' });
      }
    }
  }

  _userMatchesSearchTerm(user) {
    const searchTerm = this.state.searchTerm.toLowerCase();
    const username = user.username.toLowerCase();
    const id = user.id.toLowerCase();

    if(username.indexOf(searchTerm) > -1) {
      return true;
    }

    if(id.indexOf(searchTerm) > -1) {
      return true;
    }

    return false;
  }

  _firstUserThatMatchesSearchTerm() {
    const friends = this.state.friends;

    for(const id in friends) {
      if(this._userMatchesSearchTerm(friends[id])) {
        return friends[id];
      }
    }
  }

  componentDidMount() {
    FriendsStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    FriendsStore.removeChangeListener(this._onChange);
  }

  render() {
    const self = this;

    return (
      <ul className="list-group">
        <li className="list-group-header">
          <input
            className="form-control"
            type="text"
            placeholder="Search by name or Steam ID"
            value={this.state.searchTerm}
            onChange={(e) => this._onSearch(e)}
            onKeyDown={(e) => this._onSearchSubmit(e)} />
        </li>
        {self.state.friends.map((friend) => {
          if(self._userMatchesSearchTerm(friend)) {
            return <FriendsListItem key={friend.id} user={friend} />;
          }
        })}
      </ul>
    );
  }
};

module.exports = FriendsList;
