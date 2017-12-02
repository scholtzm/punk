const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');

const Loader = require('../../components/misc/Loader.js');

class SteamGuard extends React.Component {
  _proceedSteamGuard(event) {
    event.preventDefault();

    this.props.callback(this._authCode.value);
    ReactDOM.render(<Loader message="Connecting..." />, document.getElementById('app'));
  }

  componentDidMount(){
    this._authCode.focus();
  }

  render() {
    return (
      <div className="window">
        <div className="window-content">
          <div className="centered">
            <center><h1 className="brand logo">Punk</h1></center>
            <form>
              <div className="form-group">
                <label>SteamGuard Auth Code</label>
                <input type="text" name="steamguard" ref={(c) => {
                  this._authCode = c; 
                }} className="form-control" placeholder="XXXXX"/>
              </div>
              <button className="btn btn-large btn-default" onClick={(e) => this._proceedSteamGuard(e)}>Continue</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

SteamGuard.propTypes = {
  callback: PropTypes.func
};

module.exports = SteamGuard;
