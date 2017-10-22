const React = require('react');

const ChatStore = require('../../stores/chat-store.js');

const Tab = require('./Tab.js');
const ChatWindow = require('./ChatWindow.js');
const MessageComposer = require('./MessageComposer.js');

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: ChatStore.getAll()
    };

    this._onChange = this._onChange.bind(this);
  }

  _tabbedCount() {
    let count = 0;

    for(const id in this.state.chats) {
      if(this.state.chats[id].tabbed) {
        count++;
      }
    }

    return count;
  }

  _onChange() {
    this.setState({ chats: ChatStore.getAll() });
  }

  _createTabs() {
    const self = this;

    if(self._tabbedCount() > 0) {
      const tabs = Object.keys(self.state.chats).map((id) => {
        // 'id' is SteamID64
        if(self.state.chats[id].tabbed) {
          return <Tab key={id} chat={self.state.chats[id]} />;
        }
      });

      return (
        <div className="tab-group">
          {tabs}
        </div>
      );
    }

    return <div/>;
  }


  componentDidMount() {
    ChatStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ChatStore.removeChangeListener(this._onChange);
  }

  render() {
    const tabs = this._createTabs();

    return (
        <div className="chat">
          {tabs}
          <ChatWindow chats={this.state.chats}/>
          <MessageComposer chats={this.state.chats}/>
        </div>
    );
  }
}

module.exports = Chat;
