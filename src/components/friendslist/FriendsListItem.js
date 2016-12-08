var remote = require('electron').remote;

var React = require('react');
var classNames = require('classnames');

var ChatActions = require('../../actions/chat-actions.js');
var Constants = require('../../constants');

var FriendsListItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  _getOnlineStateClassName: function() {
    if(this.props.user.inGame) {
      return 'in-game-border';
    }

    switch (this.props.user.stateEnum) {
      case 0:
        return 'offline-border';
      default:
        return 'online-border';
    }
  },

  _getRelationshipStateClassName: function() {
    return 'relationship-' + this.props.user.relationshipEnum;
  },

  _onDoubleClick: function(event) {
    event.preventDefault();
    if(this.props.user.relationshipEnum === Constants.SteamEnums.EFriendRelationship.Friend) {
      ChatActions.openChat(this.props.user);
    }
  },

  _onContextMenu: function(event) {
    event.preventDefault();
    var menu = require('../../ui/menus/friends-menu.js')(this.props.user);
    menu.popup(remote.getCurrentWindow());
  },

  render: function() {
    var classNameItem = classNames('list-group-item', this._getRelationshipStateClassName());
    var classNameAvatar = classNames('img-circle', 'media-object', 'pull-left', this._getOnlineStateClassName());

    return (
      <li className={classNameItem} onDoubleClick={this._onDoubleClick} onContextMenu={this._onContextMenu}>
        <img className={classNameAvatar} src={this.props.user.avatar} width="32" height="32" />
        <div className="media-body">
          <strong>{this.props.user.username}</strong>
          <p>{this.props.user.state}</p>
        </div>
      </li>
    );
  }
});

module.exports = FriendsListItem;
