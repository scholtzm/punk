var remote = require('electron').remote;

var React = require('react');
var classNames = require('classnames');

var CurrentUser = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  _getStateClassName: function() {
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
  },

  _onClick: function() {
    var menu = require('../../ui/menus/current-user-menu.js')(this.props.user);
    menu.popup(remote.getCurrentWindow());
  },

  render: function() {
    var className = classNames('fa', 'fa-circle', this._getStateClassName());
    var userName = this.props.user.username
      ? this.props.user.username + ' '
      : 'Loading...';
    var caret = this.props.user.username ? <i className="fa fa-caret-down"></i> : '';
    var title = this.props.user.state;

    return (
      <button className="btn btn-default" onClick={this._onClick} title={title}>
        <i className={className}></i>
        {' '}
        {userName}
        {caret}
      </button>
    );
  }
});

module.exports = CurrentUser;
