var React = require('react');

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
  render: function() {
    var self = this;
    return (
      <ul className="list-group">
        <li className="list-group-header">
          <input className="form-control" type="text" placeholder="Search by name" />
        </li>
        {Object.keys(self.props.friends).map(function(id) {
          return <FriendsListItem key={id} user={self.props.friends[id]} />;
        })}
      </ul>
    );
  }
});

module.exports = FriendsList;
