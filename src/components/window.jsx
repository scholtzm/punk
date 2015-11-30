var React = require('react');

var Main = require('./main.js');

var Window = React.createClass({
  render: function() {
    return (
      <div className="window">
        <header className="toolbar toolbar-header">
          <h1 className="title">Punk</h1>

          <div className="toolbar-actions">
            <div className="btn-group">
              <button className="btn btn-default">
                <span className="icon icon-user-add"></span>
              </button>
              <button className="btn btn-default">
                <span className="icon icon-cog"></span>
              </button>
            </div>

            <button className="btn btn-default pull-right">
              <span className="icon icon-cancel-circled"></span>
            </button>
          </div>
        </header>

        <div id="main" className="window-content">
          <Main users={punk.friendsList} chats={punk.chats}/>
        </div>
      </div>
    );
  }
});

module.exports = Window;
