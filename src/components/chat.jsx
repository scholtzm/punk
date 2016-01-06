var remote = require('remote');
var shell = require('electron').shell;

var React = require('react');
var Linkify = require('react-linkify');
var classNames = require('classnames');

var ChatActions = require('../actions/chat-actions.js');
var ChatStore = require('../stores/chat-store.js');
var Constants = require('../constants');
var SteamCommunityWindow = require('./windows/steam-community.js');

var ENTER_KEY = 13;

var Tab = React.createClass({
  _onClick: function(event) {
    event.stopPropagation();
    ChatActions.switchChat(this.props.chat);
  },

  _onClose: function(event) {
    event.stopPropagation();
    ChatActions.closeChat(this.props.chat);
  },

  render: function() {
    var className = classNames('tab-item', {'active': this.props.chat.visible});
    var title = this.props.chat.unreadMessageCount > 0 ? '(' + this.props.chat.unreadMessageCount + ') ' : '';
    title += this.props.chat.username;

    return (
      <div className={className} onClick={this._onClick}>
        <span className="icon icon-cancel icon-close-tab" onClick={this._onClose}></span>
        {title}
      </div>
    );
  }
});

var ChatMessage = React.createClass({
  _onAcceptTradeRequest: function() {
    ChatActions.respondToTradeRequest(this.props.chat, this.props.message, true);
  },

  _onDeclineTradeRequest: function() {
    ChatActions.respondToTradeRequest(this.props.chat, this.props.message, false);
  },

  _onCancelTradeRequest: function() {
    ChatActions.cancelTradeRequest(this.props.chat.id);
  },

  render: function() {
    var message = this.props.message;

    var text = message.text.split('\n').map(function(line, indexLine) {
      // using index as a key shouldn't be an issue here
      return (
        <p key={indexLine}>
          <Linkify properties={{
            onClick: function(event) {
              event.preventDefault();

              if(event.target.host === 'steamcommunity.com' ||
                 event.target.host === 'store.steampowered.com') {
                SteamCommunityWindow.open(event.target.href);
              } else {
                shell.openExternal(event.target.href);
              }
            }
          }}>
            {line}
          </Linkify>
        </p>
      );
    });

    var extra;
    if(message.type === Constants.MessageTypes.CHAT_THEIR_TRADE_REQUEST) {
      if(message.meta.response) {
        extra = (
          <p><i>Trade request state: {message.meta.response}</i></p>
        );
      } else {
        extra = (
          <p>
            <a href="#" onClick={this._onAcceptTradeRequest}>Accept</a>
            {' or '}
            <a href="#" onClick={this._onDeclineTradeRequest}>Decline</a>
          </p>
        );
      }
    }

    if(message.type === Constants.MessageTypes.CHAT_OUR_TRADE_REQUEST) {
      if(message.meta.response) {
        extra = (
          <p><i>Trade request state: {message.meta.response}</i></p>
        );
      } else {
        extra = (
          <p>
            <a href="#" onClick={this._onCancelTradeRequest}>Cancel</a>
          </p>
        );
      }
    }

    return (
      <li
        className={message.type}>
        <div>
          <small>{message.date.toTimeString()}</small>
          {text}
          {extra}
        </div>
      </li>
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

  _onContextMenu: function(event) {
    event.preventDefault();
    var menu = require('./menus/chat-menu.js')(this._findVisibleChat());
    menu.popup(remote.getCurrentWindow());
  },

  componentDidUpdate: function() {
    var node = this.refs.content;

    if(!node) {
      return;
    }

    node.scrollTop = node.scrollHeight;
  },

  render: function() {
    var chat = this._findVisibleChat();

    if(!chat) {
      return <div/>;
    }

    return (
      <div className="chat-window">
        <div className="chat-window-content" ref="content" onContextMenu={this._onContextMenu}>
          <ul>
            {chat.messages.map(function(message) {
              return <ChatMessage key={message.id} chat={chat} message={message} />;
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
        return this.props.chats[id];
      }
    }
  },

  _onChange: function(event) {
    this.setState({text: event.target.value});
  },

  _onKeyDown: function(event) {
    if(event.keyCode === ENTER_KEY && !event.shiftKey) {
      event.preventDefault();
      var text = this.state.text.trim();
      if(text) {
        var targetChat = this._findVisibleChat();

        ChatActions.newOutgoingMessage({
          type: Constants.MessageTypes.CHAT_OUR_MESSAGE,
          target: targetChat.id,
          username: targetChat.username,
          date: new Date(),
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
    var visible = this._findVisibleChat();

    if(!visible) {
      return <div/>;
    }

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
  _tabbedCount: function() {
    var count = 0;

    for(var id in this.state.chats) {
      if(this.state.chats[id].tabbed) {
        count++;
      }
    }

    return count;
  },

  _onChange: function() {
    this.setState({ chats: ChatStore.getAll() });
  },

  _createTabs: function() {
    var self = this;

    if(self._tabbedCount() > 0) {
      var tabs = Object.keys(self.state.chats).map(function(id) {
        // 'id' is SteamID64
        if(self.state.chats[id].tabbed) {
          return <Tab key={id} chat={self.state.chats[id]} />;
        }
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
