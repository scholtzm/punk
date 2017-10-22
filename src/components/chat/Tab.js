const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');

const ChatActions = require('../../actions/chat-actions.js');
const FriendsStore = require('../../stores/friends-store.js');

class Tab extends React.Component {
  constructor(props) {
    super(props);

    this.state = { friend: FriendsStore.getById(this.props.chat.id) };

    this._onChange = this._onChange.bind(this);
  }

  _onClick(event) {
    event.stopPropagation();
    ChatActions.switchChat(this.props.chat);
  }

  _onClose(event) {
    event.stopPropagation();
    ChatActions.closeChat(this.props.chat);
  }

  _getStateClassName() {
    const user = this.state.friend;

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
  }

  _onChange() {
    this.setState({ friend: FriendsStore.getById(this.props.chat.id) });
  }

  componentDidMount() {
    FriendsStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    FriendsStore.removeChangeListener(this._onChange);
  }

  render() {
    const tabClassName = classNames('tab-item', { 'active': this.props.chat.visible });
    const onlineStateClassName = classNames('fa', 'fa-circle', this._getStateClassName());

    let tabTitle = this.props.chat.unreadMessageCount > 0 ? `(${ this.props.chat.unreadMessageCount }) ` : '';
    tabTitle += this.state.friend ? this.state.friend.username : '';

    return (
      <div className={tabClassName} onClick={(e) => this._onClick(e)} title={tabTitle}>
        <span className="icon icon-cancel icon-close-tab" onClick={(e) => this._onClose(e)}></span>
        <i className={onlineStateClassName}></i>
        {' '}
        {tabTitle}
      </div>
    );
  }
};

Tab.propTypes = {
  chat: PropTypes.object.isRequired
};

module.exports = Tab;
