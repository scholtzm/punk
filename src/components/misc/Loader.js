const React = require('react');
const PropTypes = require('prop-types');

class Loader extends React.Component {
  render() {
    return (
      <div className="window">
        <div className="window-content">
          <div className="centered">
            <center>
              <h1 className="brand logo">Punk</h1><br/>
              <h2><i className="fa fa-refresh fa-spin"></i></h2>
              <h4>{this.props.message}</h4>
            </center>
          </div>
        </div>
      </div>
    );
  }
};

Loader. propTypes = {
  message: PropTypes.string
};

module.exports = Loader;
