var React = require('react');

var FriendsList = require('./friendslist.js');
var Chat = require('./chat.js');

var Main = React.createClass({
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
          <div className="pane-group">
            <div className="pane pane-sm sidebar">
              <FriendsList friends={this.props.friends}/>
            </div>
            <div className="pane">
              <Chat chats={this.props.chats}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Main;
