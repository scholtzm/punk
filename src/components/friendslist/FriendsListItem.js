const remote = require('electron').remote;

const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');

const ChatActions = require('../../actions/chat-actions.js');
const Constants = require('../../constants');

class FriendsListItem extends React.Component {
  _getOnlineStateClassName() {
    if(this.props.user.relationshipEnum === Constants.SteamEnums.EFriendRelationship.IgnoredFriend) {
      return 'blocked-border';
    }

    if(this.props.user.inGame) {
      return 'in-game-border';
    }

    switch (this.props.user.stateEnum) {
      case 0:
        return 'offline-border';
      default:
        return 'online-border';
    }
  }

  _getRelationshipStateClassName() {
    return `relationship-${ this.props.user.relationshipEnum}`;
  }

  _onDoubleClick(event) {
    event.preventDefault();
    if(this.props.user.relationshipEnum === Constants.SteamEnums.EFriendRelationship.Friend) {
      ChatActions.openChat(this.props.user);
    }
  }

  _onContextMenu(event) {
    event.preventDefault();
    const menu = require('../../ui/menus/friends-menu.js')(this.props.user);
    menu.popup(remote.getCurrentWindow());
  }

  render() {
    const classNameItem = classNames('list-group-item', this._getRelationshipStateClassName(), this._getOnlineStateClassName());
    const classNameAvatar = classNames('img-circle', 'media-object', 'pull-left', this._getOnlineStateClassName());

    return (
      <li className={classNameItem} onDoubleClick={(e) => this._onDoubleClick(e)} onContextMenu={(e) => this._onContextMenu(e)}>
        <img className={classNameAvatar} src={this.props.user.avatar} width="32" height="32" />
        <div className="media-body">
          <strong>{this.props.user.username}</strong>
          <p>{this.props.user.state}</p>
        </div>
      </li>
    );
  }
};

FriendsListItem.propTypes = {
  user: PropTypes.object.isRequired
};

module.exports = FriendsListItem;
