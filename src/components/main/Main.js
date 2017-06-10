const React = require('react');

const FriendsList = require('../friendslist/FriendsList.js');
const Chat = require('../chat/Chat.js');
const Toolbar = require('../toolbar/Toolbar.js');

const ChangeNameDialog = require('../dialogs/ChangeNameDialog.js');
const AddFriendDialog = require('../dialogs/AddFriendDialog.js');

class Main extends React.Component {
  render() {
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
};

module.exports = Main;
