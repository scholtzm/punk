var React = require('react');

var FriendsList = require('./friendslist.js');
var Chat = require('./chat.js');

var Main = React.createClass({
  render: function() {
    return (
      <div className="pane-group">
        <div className="pane pane-sm sidebar">
          <FriendsList users={this.props.users}/>
        </div>
        <div className="pane">
          <Chat chats={this.props.chats}/>
        </div>
      </div>
    );
  }
});

module.exports = Main;
