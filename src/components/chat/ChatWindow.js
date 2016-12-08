var remote = require('electron').remote;

var React = require('react');

var ChatMessage = require('./ChatMessage.js');

var ChatWindow = React.createClass({
  propTypes: {
    chats: React.PropTypes.object.isRequired
  },

  _findVisibleChat: function() {
    for(var id in this.props.chats) {
      if(this.props.chats[id].visible) {
        return this.props.chats[id];
      }
    }
  },

  _onContextMenu: function(event) {
    event.preventDefault();

    var chat = this._findVisibleChat();

    if(!chat) {
      return;
    }

    var menu = require('../ui/menus/chat-menu.js')(chat);
    menu.popup(remote.getCurrentWindow());
  },

  componentWillUpdate: function() {
    var node = this.refs.content;
    this._shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  },

  componentDidUpdate: function() {
    if(!this._shouldScrollBottom) {
      return;
    }

    var node = this.refs.content;
    node.scrollTop = node.scrollHeight;
  },

  render: function() {
    var chat = this._findVisibleChat();
    var messages;

    if(chat) {
      messages = chat.messages.map(function(message) {
        return <ChatMessage key={message.id} chat={chat} message={message} />;
      });
    }

    return (
      <div className="chat-window">
        <div className="chat-window-content" ref="content" onContextMenu={this._onContextMenu}>
          <ul>
            {messages}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = ChatWindow;
