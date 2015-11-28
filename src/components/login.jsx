var React = require('react');

var Login = React.createClass({
  _proceedLogin: function(event) {
    event.preventDefault();

    punk.init(this.state.username, this.state.password);
    punk.loadPlugins();
    punk.connect();
  },

  _handleUsernameChange: function(event) {
    this.setState({username: event.target.value});
  },

  _handlePasswordChange: function(event) {
    this.setState({password: event.target.value});
  },

  getInitialState: function() {
    return {
      username: '',
      password: ''
    };
  },

  render: function() {
    return (
      <div className="centered">
        <center><h1>Punk</h1></center>
        <form>
          <div className="form-group">
            <label>Username</label>
            <input type="email" name="username" value={this.state.username} onChange={this._handleUsernameChange} className="form-control" placeholder="Username"/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={this.state.password} onChange={this._handlePasswordChange} className="form-control" placeholder="Password"/>
          </div>
          <button className="btn btn-large btn-default" onClick={this._proceedLogin} >Login</button>
        </form>
      </div>
    );
  }
});

module.exports = Login;
