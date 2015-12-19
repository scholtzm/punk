var React = require('react');

var FriendsList = require('./friendslist.js');
var Chat = require('./chat.js');
var Toolbar = require('./toolbar.js');
var ChangeNameDialog = require('./dialogs/change-name.js');

var Main = React.createClass({
  render: function() {
    return (
      <div className="window">
        <ChangeNameDialog />

        <header className="toolbar toolbar-header">
          <h1 className="title">Punk</h1>

          <Toolbar />
        </header>

        <div className="divider"></div>

        <div id="main" className="window-content">
          <div className="pane-group">
            <div className="pane pane-sm sidebar">
              <div className="friendslist">
                <div className="friendslist-content">
                  <FriendsList />
                </div>
              </div>
            </div>
            <div className="pane">
              <Chat />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Main;
