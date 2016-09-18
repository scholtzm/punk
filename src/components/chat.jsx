var remote = require('electron').remote;

var React = require('react');
var Linkify = require('react-linkify').default;
var classNames = require('classnames');
var moment = require('moment');

var ChatActions = require('../actions/chat-actions.js');
var ChatStore = require('../stores/chat-store.js');
var FriendsStore = require('../stores/friends-store.js');
var Constants = require('../constants');
var SteamCommunityWindow = require('../ui/windows/steam-community.js');
var urlHelper = require('../utils/url-helper.js');

var ENTER_KEY = 13;

var Tab = React.createClass({
  propTypes: {
    chat: React.PropTypes.object.isRequired
  },

  _onClick: function(event) {
    event.stopPropagation();
    ChatActions.switchChat(this.props.chat);
  },

  _onClose: function(event) {
    event.stopPropagation();
    ChatActions.closeChat(this.props.chat);
  },

  _getStateClassName: function() {
    var user = this.state.friend;

    if(!user || !user.stateEnum) {
      return 'offline';
    }

    if(user.inGame) {
      return 'in-game';
    }

    switch (user.stateEnum) {
      case 0:
        return 'offline';
      default:
        return 'online';
    }
  },

  _onChange: function() {
    this.setState({ friend: FriendsStore.getById(this.props.chat.id) });
  },

  getInitialState: function() {
    return { friend: FriendsStore.getById(this.props.chat.id) };
  },

  componentDidMount: function() {
    FriendsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    FriendsStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var tabClassName = classNames('tab-item', { 'active': this.props.chat.visible });
    var onlineStateClassName = classNames('fa', 'fa-circle', this._getStateClassName());

    var tabTitle = this.props.chat.unreadMessageCount > 0 ? '(' + this.props.chat.unreadMessageCount + ') ' : '';
    tabTitle += this.state.friend ? this.state.friend.username : '';

    return (
      <div className={tabClassName} onClick={this._onClick} title={tabTitle}>
        <span className="icon icon-cancel icon-close-tab" onClick={this._onClose}></span>
        <i className={onlineStateClassName}></i>
        {' '}
        {tabTitle}
      </div>
    );
  }
});

var ChatMessage = React.createClass({
  propTypes: {
    chat: React.PropTypes.object.isRequired,
    message: React.PropTypes.object.isRequired
  },

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
              var url = event.target.href;

              event.preventDefault();

              if(urlHelper.isSteamUrl(url)) {
                SteamCommunityWindow.open(url);
              } else {
                urlHelper.openExternal(url);
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
          <small>{moment(message.date).format('HH:mm:ss')}</small>
          {text}
          {extra}
        </div>
      </li>
    );
  }
});

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

var MessageComposer = React.createClass({
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

  _onChange: function(event) {
    this.setState({ text: event.target.value });
  },

  _onKeyDown: function(event) {
    if(event.keyCode === ENTER_KEY && !event.shiftKey) {
      event.preventDefault();
      var text = this.state.text.trim();
      if(text !== '') {
        var targetChat = this._findVisibleChat();

        ChatActions.newOutgoingMessage({
          type: Constants.MessageTypes.CHAT_OUR_MESSAGE,
          target: targetChat.id,
          username: targetChat.username,
          date: new Date(),
          text: text
        });
      }
      this.setState({ text: '' });
    }
  },

  getInitialState: function() {
    return { text: '' };
  },

  componentDidUpdate: function() {
    if(this.refs.textArea) {
      this.refs.textArea.focus();
    }
  },

  render: function() {
    var visible = this._findVisibleChat();

    if(!visible) {
      return <div/>;
    }

    var extraInfo = (
      <div className="extra-info">
        <i className="fa fa-comment-o"></i> You are chatting with {visible.username}
      </div>
    );

    if(visible.typing) {
      extraInfo = (
        <div className="extra-info">
          <i className="fa fa-commenting-o"></i> {visible.username} is typing...
        </div>
      );
    }

    return (
      <div className="message-composer">
        {extraInfo}
        <textarea
          ref="textArea"
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
