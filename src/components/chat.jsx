var React = require('react');

var Tab = React.createClass({
  render: function() {
    return (
      <div className="tab-item">
        <span className="icon icon-cancel icon-close-tab"></span>
        {this.props.chat.name}
      </div>
    );
  }
});

var ChatWindow = React.createClass({
  _findVisibleChat: function() {
    for(var id in this.props.chats) {
      if(this.props.chats[id].visible) {
        return this.props.chats[id];
      }
    }
  },

  render: function() {
    var chat = this._findVisibleChat();

    if(!chat) {
      return <div clasName="chat-window"></div>;
    }

    return (
      <div className="chat-window">
        <ul>
          {chat.messages.map(function(message) {
            return <li>{message}</li>;
          })}
        </ul>
      </div>
    );
  }
});

var Chat = React.createClass({
  render: function() {
    var self = this;
    return (
      <div className="chat">
        <div className="tab-group">
          {Object.keys(self.props.chats).map(function(id) {
            return <Tab key={id} chat={self.props.chats[id]} />;
          })}
        </div>
        <ChatWindow chats={self.props.chats}/>
      </div>
    );
  }
});

module.exports = Chat;
