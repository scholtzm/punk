var React = require('react');

var Loader = React.createClass({
  render: function() {
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
});

module.exports = Loader;
