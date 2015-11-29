var React = require('react');

var Main = React.createClass({
  render: function() {
    return (
      <div className="pane-group">
        <div className="pane pane-sm sidebar">
          Sidebar
        </div>
        <div className="pane">
          Hello
        </div>
      </div>
    );
  }
});

module.exports = Main;
