var React = require('react');

var ChatActions = require('../actions/chat-actions.js');
var ChatStore = require('../stores/chat-store.js');

var ENTER_KEY = 13;

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
      <div className="chat-window">
        <div className="chat-window-content">
          <ul>
            {chat.messages.map(function(message) {
              return <li className={message.type}><span>{message.text}</span></li>;
            })}
          </ul>
        </div>
      </div>
    );
  }
});

var MessageComposer = React.createClass({
  _findVisibleChat: function() {
    for(var id in this.props.chats) {
      if(this.props.chats[id].visible) {
        return { id: id, chat: this.props.chats[id] };
      }
    }
  },

  _onChange: function(event) {
    this.setState({text: event.target.value});
  },

  _onKeyDown: function(event) {
    if(event.keyCode === ENTER_KEY) {
      event.preventDefault();
      var text = this.state.text.trim();
      if(text) {
        var targetChat = this._findVisibleChat();

        ChatActions.newOutgoingMessage({
          target: targetChat.id,
          text: text
        });
      }
      this.setState({text: ''});
    }
  },

  getInitialState: function() {
    return {text: ''};
  },

  render: function() {
    return (
    <div className="message-composer">
      <textarea
        rows="3"
        className="form-control"
        name="message"
        value={this.state.text}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown} />
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
        <MessageComposer chats={this.state.chats}/>
      </div>
    );
  }
});

module.exports = Chat;
