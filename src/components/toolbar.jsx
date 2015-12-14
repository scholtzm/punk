var React = require('react');

var UserStore = require('../stores/user-store.js');

var Toolbar = React.createClass({
  _onChange: function() {
    this.setState({ user: UserStore.get() });
  },

  _getClassName: function() {
    if(!this.state.user.stateEnum) {
      return 'offline';
    }

    if(this.state.user.inGame) {
      return 'in-game';
    }

    switch (this.state.user.stateEnum) {
      case 0:
        return 'offline';
      default:
        return 'online';
    }
  },

  getInitialState: function() {
    return {
      user: UserStore.get()
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var className = 'fa fa-circle ' + this._getClassName();

    return (
      <div className="toolbar-actions">
        <button className="btn btn-default">
          <i className={className}></i>&nbsp;
          {this.state.user.username || 'Loading...'}
        </button>

        <div className="btn-group">
          <button className="btn btn-default">
            <i className="fa fa-user-plus"></i>
          </button>
          <button className="btn btn-default">
            <i className="fa fa-cog"></i>
          </button>
        </div>

        <button className="btn btn-default pull-right">
          <i className="fa fa-sign-out"></i>
        </button>
      </div>
    );
  }
});

module.exports = Toolbar;
