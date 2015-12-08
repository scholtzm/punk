var React = require('react');

var ChatStore = require('../stores/chat-store.js');

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
  _onChange: function() {
    this.setState({ chats: ChatStore.getAll() });
  },

  _createTabs: function() {
    var self = this;
    var tabs = <div/>;

    if(Object.keys(self.state.chats).length > 0) {
      tabs = Object.keys(self.state.chats).map(function(id) {
        return (
          <div className="tab-group">
            <Tab key={id} chat={self.state.chats[id]} />;
          </div>
        );
      });
    }

    return tabs;
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
      </div>
    );
  }
});

module.exports = Chat;
