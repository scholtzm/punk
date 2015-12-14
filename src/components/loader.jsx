var React = require('react');

var Loader = React.createClass({
  render: function() {
    return (
      <div className="window">
        <header className="toolbar toolbar-header">
          <h1 className="title">Punk</h1>
        </header>

        <div className="window-content">
          <div className="centered">
            <center>
              <h1 className="brand logo">Punk</h1><br/>
              <h3><span className="icon icon-arrows-ccw"></span> Loading...</h3>
            </center>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Loader;
