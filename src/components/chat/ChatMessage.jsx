var React = require('react');
var Linkify = require('react-linkify').default;
var moment = require('moment');

var ChatActions = require('../../actions/chat-actions.js');
var Constants = require('../../constants');
var SteamCommunityWindow = require('../../ui/windows/steam-community.js');
var urlHelper = require('../../utils/url-helper.js');

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

module.exports = ChatMessage;
