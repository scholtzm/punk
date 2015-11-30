var fs = require('fs');
var React = require('react');
var ReactDOM = require('react-dom');

var Loader = require('./loader.js');

var Login = React.createClass({
  _proceedLogin: function(event) {
    event.preventDefault();

    var username = this.state.username;
    var password = this.state.password;

    if(this.state.rememberMe) {
      fs.writeFileSync(punk.userConfig, JSON.stringify({username: username, password: password}, null, 2));
    }

    ReactDOM.render(<Loader />, document.getElementById('app'));

    punk.init(username, password);
    punk.loadPlugins();
    punk.connect();
  },

  _handleUsernameChange: function(event) {
    this.setState({username: event.target.value});
  },

  _handlePasswordChange: function(event) {
    this.setState({password: event.target.value});
  },

  _handleRememberMeChanged: function(event) {
    this.setState({rememberMe: event.target.value});
  },

  getInitialState: function() {
    return {
      username: '',
      password: '',
      rememberMe: false
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
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={this.state.rememberMe} onChange={this._handleRememberMeChanged} /> Remember Me
            </label>
          </div>
          <button className="btn btn-large btn-default" onClick={this._proceedLogin} >Login</button>
        </form>
      </div>
    );
  }
});

module.exports = Login;
