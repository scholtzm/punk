var React = require('react');

var ChatStore = require('../stores/chat-store.js');

var Tab = React.createClass({
  render: function() {
    var className = this.props.chat.visible ? 'tab-item active': 'tab-item';
    return (
      <div className={className}>
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
      return <div class="chat-window"></div>;
    }

    return (
      <div class="chat-window">
        <ul>
          {chat.messages.map(function(message) {
            return <li>{message}</li>;
          })}
        </ul>
      </div>
    );
  }
});

var MessageComposer = React.createClass({
  render: function() {
    return (
    <div class="message-composer">
      <textarea className="form-control" rows="3"></textarea>
    </div>
    );
  }
});

var Chat = React.createClass({
  _onChange: function() {
    this.setState({ chats: ChatStore.getAll() });
  },

  _createTabs: function() {
    var self = this;

    if(Object.keys(self.state.chats).length > 0) {
      var tabs = Object.keys(self.state.chats).map(function(id) {
        return <Tab key={id} chat={self.state.chats[id]} />;
      });

      return (
        <div className="tab-group">
          {tabs}
        </div>
      );
    }

    return <div/>;
  },

  getInitialState: function() {
    return { chats: ChatStore.getAll() };
  },

  componentDidMount: function() {
    ChatStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ChatStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var tabs = this._createTabs();

    return (
      <div className="chat">
        {tabs}
        <ChatWindow chats={this.state.chats}/>
        <MessageComposer />
      </div>
    );
  }
});

module.exports = Chat;
