const React = require('react');
const PropTypes = require('prop-types');
const Linkify = require('react-linkify').default;
const moment = require('moment');

const ChatActions = require('../../actions/chat-actions.js');
const Constants = require('../../constants');
const SteamCommunityWindow = require('../../ui/windows/steam-community.js');
const urlHelper = require('../../utils/url-helper.js');

class ChatMessage extends React.Component {
  _onAcceptTradeRequest() {
    ChatActions.respondToTradeRequest(this.props.chat, this.props.message, true);
  }

  _onDeclineTradeRequest() {
    ChatActions.respondToTradeRequest(this.props.chat, this.props.message, false);
  }

  _onCancelTradeRequest() {
    ChatActions.cancelTradeRequest(this.props.chat.id);
  }

  render() {
    const message = this.props.message;

    const text = message.text.split('\n').map((line, indexLine) =>
      // using index as a key shouldn't be an issue here
      (
        <p key={indexLine}>
          <Linkify properties={{
            onClick(event) {
              const url = event.target.href;

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
      )
    );

    let extra;
    if(message.type === Constants.MessageTypes.CHAT_THEIR_TRADE_REQUEST) {
      if(message.meta.response) {
        extra = (
          <p><i>Trade request state: {message.meta.response}</i></p>
        );
      } else {
        extra = (
          <p>
            <a href="#" onClick={(e) => this._onAcceptTradeRequest(e)}>Accept</a>
            {' or '}
            <a href="#" onClick={(e) => this._onDeclineTradeRequest(e)}>Decline</a>
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
            <a href="#" onClick={(e) => this._onCancelTradeRequest(e)}>Cancel</a>
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
};

ChatMessage.propTypes = {
  chat: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired
};

module.exports = ChatMessage;
