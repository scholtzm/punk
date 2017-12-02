const remote = require('electron').remote;

const React = require('react');
const PropTypes = require('prop-types');

const ChatMessage = require('./ChatMessage.js');

class ChatWindow extends React.Component {
  _findVisibleChat() {
    for(const id in this.props.chats) {
      if(this.props.chats[id].visible) {
        return this.props.chats[id];
      }
    }
  }

  _onContextMenu(event) {
    event.preventDefault();

    const chat = this._findVisibleChat();

    if(!chat) {
      return;
    }

    const menu = require('../../ui/menus/chat-menu.js')(chat);
    menu.popup(remote.getCurrentWindow());
  }

  componentWillUpdate() {
    const node = this._content;
    this._shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  }

  componentDidUpdate() {
    if(!this._shouldScrollBottom) {
      return;
    }

    const node = this._content;
    node.scrollTop = node.scrollHeight;
  }

  render() {
    const chat = this._findVisibleChat();
    let messages;

    if(chat) {
      messages = chat.messages
        .map((message) => <ChatMessage key={message.id} chat={chat} message={message} />);
    }

    return (
      <div className="chat-window">
        <div className="chat-window-content" ref={(c) => {
          this._content = c;
        }} onContextMenu={(e) => this._onContextMenu(e)}>
          <ul>
            {messages}
          </ul>
        </div>
      </div>
    );
  }
};

ChatWindow.propTypes = {
  chats: PropTypes.object.isRequired
};

module.exports = ChatWindow;
