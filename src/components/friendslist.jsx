var React = require('react');

var FriendsStore = require('../stores/friends-store.js');

var FriendsListItem = React.createClass({
  render: function() {
    return (
      <li className="list-group-item">
        <img className="img-circle media-object pull-left" src={this.props.user.avatar} width="32" height="32" />
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

  getInitialState: function() {
    return { friends: FriendsStore.getAll() };
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
          <input className="form-control" type="text" placeholder="Search by name" />
        </li>
        {Object.keys(self.state.friends).map(function(id) {
          return <FriendsListItem key={id} user={self.state.friends[id]} />;
        })}
      </ul>
    );
  }
});

module.exports = FriendsList;
