var fs = require('fs');
var React = require('react');
var ReactDOM = require('react-dom');

var Loader = require('./loader.js');

var Login = React.createClass({
  _proceedLogin: function(event) {
    event.preventDefault();

    var username = this.refs.username.value;
    var password = this.refs.password.value;
    var rememberMe = this.refs.rememberMe.checked;

    if(rememberMe) {
      fs.writeFileSync(punk.userConfig, JSON.stringify({username: username, password: password}, null, 2));
    }

    ReactDOM.render(<Loader message="Connecting..."/>, document.getElementById('app'));

    punk.init(username, password);
    punk.loadPlugins();
    punk.connect();
  },

  render: function() {
    return (
      <div className="window">
        <header className="toolbar toolbar-header">
          <h1 className="title">Punk</h1>
        </header>

        <div className="window-content">
          <div className="centered">
            <center>
              <h1 className="brand logo">Punk</h1>
              <h4>{this.props.message}</h4>
            </center>
            <form>
              <div className="form-group">
                <label>Username</label>
                <input type="email" name="username" ref="username" className="form-control" placeholder="Username"/>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" ref="password" className="form-control" placeholder="Password"/>
              </div>
              <div className="checkbox">
                <label>
                  <input type="checkbox" ref="rememberMe" /> Remember Me
                </label>
              </div>
              <button className="btn btn-large btn-default" onClick={this._proceedLogin} >Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Login;
