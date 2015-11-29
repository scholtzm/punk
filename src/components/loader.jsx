var React = require('react');

var Loader = React.createClass({
  render: function() {
    return (
      <div className="centered">
        <center>
          <h1>Punk</h1><br/>
          <h3><span className="icon icon-arrows-ccw"></span> Loading...</h3>
        </center>
      </div>
    );
  }
});

module.exports = Loader;
