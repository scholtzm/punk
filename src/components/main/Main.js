var React = require('react');

var FriendsList = require('../friendslist/FriendsList.js');
var Chat = require('../chat/Chat.js');
var Toolbar = require('../toolbar/Toolbar.js');

var ChangeNameDialog = require('../dialogs/ChangeNameDialog.js');
var AddFriendDialog = require('../dialogs/AddFriendDialog.js');

var Main = React.createClass({
  render: function() {
    return (
      <div className="window">
        <ChangeNameDialog />
        <AddFriendDialog />

        <header className="toolbar toolbar-header">
          <Toolbar />
        </header>

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
