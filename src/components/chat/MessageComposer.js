const React = require('react');
const PropTypes = require('prop-types');

const ChatActions = require('../../actions/chat-actions.js');
const Constants = require('../../constants');

const ENTER_KEY = 13;

class MessageComposer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { text: '' };
  }

  _findVisibleChat() {
    for(const id in this.props.chats) {
      if(this.props.chats[id].visible) {
        return this.props.chats[id];
      }
    }
  }

  _onChange(event) {
    this.setState({ text: event.target.value });

    const visible = this._findVisibleChat();

    if(!visible) {
      return;
    }

    ChatActions.weAreTyping(visible.id);
  }

  _onKeyDown(event) {
    if(event.keyCode === ENTER_KEY && !event.shiftKey) {
      event.preventDefault();
      const text = this.state.text.trim();
      if(text !== '') {
        const targetChat = this._findVisibleChat();

        ChatActions.newOutgoingMessage({
          type: Constants.MessageTypes.CHAT_OUR_MESSAGE,
          target: targetChat.id,
          username: targetChat.username,
          date: new Date(),
          text
        });
      }
      this.setState({ text: '' });
    }
  }

  componentDidUpdate() {
    if(this._textArea) {
      this._textArea.focus();
    }
  }

  render() {
    const visible = this._findVisibleChat();

    if(!visible) {
      return null;
    }

    let extraInfo = (
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
          ref={(c) => {
            this._textArea = c; 
          }}
          rows="3"
          className="form-control"
          name="message"
          value={this.state.text}
          onChange={(e) => this._onChange(e)}
          onKeyDown={(e) => this._onKeyDown(e)} />
      </div>
    );
  }
};

MessageComposer.propTypes = {
  chats: PropTypes.object.isRequired
};

module.exports = MessageComposer;
