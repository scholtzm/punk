const remote = require('electron').remote;

const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');

class CurrentUser extends React.Component {
  _getStateClassName() {
    if(!this.props.user.stateEnum) {
      return 'offline';
    }

    if(this.props.user.inGame) {
      return 'in-game';
    }

    switch (this.props.user.stateEnum) {
      case 0:
        return 'offline';
      default:
        return 'online';
    }
  }

  _onClick() {
    const menu = require('../../ui/menus/current-user-menu.js')(this.props.user);
    menu.popup(remote.getCurrentWindow());
  }

  render() {
    const className = classNames('fa', 'fa-circle', this._getStateClassName());
    const userName = this.props.user.username
      ? `${this.props.user.username } `
      : 'Loading...';
    const caret = this.props.user.username ? <i className="fa fa-caret-down"></i> : '';
    const title = this.props.user.state;

    return (
      <button className="btn btn-default" onClick={(e) => this._onClick(e)} title={title}>
        <i className={className}></i>
        {' '}
        {userName}
        {caret}
      </button>
    );
  }
};

CurrentUser.propTypes = {
  user: PropTypes.object.isRequired
};

module.exports = CurrentUser;
