const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');

const Loader = require('../misc/Loader.js');

class Login extends React.Component {
  _proceedLogin(event) {
    event.preventDefault();

    const username = this._username.value;
    const password = this._password.value;
    const rememberMe = this._rememberMe.checked;

    ReactDOM.render(<Loader message="Connecting..."/>, document.getElementById('app'));

    punk.init({
      username,
      password,
      rememberPassword: rememberMe
    }, () => {
      punk.loadPlugins();
      punk.connect();
    });
  }

  render() {
    return (
      <div className="window">
        <div className="window-content">
          <div className="centered">
            <center>
              <h1 className="brand logo">Punk</h1>
              <h4>{this.props.message}</h4>
            </center>
            <form>
              <div className="form-group">
                <label>Username</label>
                <input type="email" name="username" ref={(c) => {
                  this._username = c; 
                }} className="form-control" placeholder="Username"/>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" ref={(c) => {
                  this._password = c; 
                }} className="form-control" placeholder="Password"/>
              </div>
              <div className="checkbox">
                <label>
                  <input type="checkbox" ref={(c) => {
                    this._rememberMe = c; 
                  }} /> Remember Me
                </label>
              </div>
              <button className="btn btn-large btn-default" onClick={(e) => this._proceedLogin(e)} >Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

Login.propTypes = {
  message: PropTypes.string
};

module.exports = Login;
