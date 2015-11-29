var React = require('react');

var SteamGuard = React.createClass({
  _proceedSteamGuard: function(event) {
    event.preventDefault();

    this.props.callback(this.state.authCode);
  },

  _handleAuthCodeChange: function(event) {
    this.setState({authCode: event.target.value});
  },

  getInitialState: function() {
    return {
      authCode: ''
    };
  },

  render: function() {
    return (
      <div className='centered'>
        <center><h1>Punk</h1></center>
        <form>
          <div className='form-group'>
            <label>SteamGuard Auth Code</label>
            <input type='text' name='steamguard' value={this.state.authCode} onChange={this._handleAuthCodeChange} className='form-control' placeholder='XXXXX'/>
          </div>
          <button className='btn btn-large btn-default' onClick={this._proceedSteamGuard}>Continue</button>
        </form>
      </div>
    );
  }
});

module.exports = SteamGuard;
