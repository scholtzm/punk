const React = require('react');

const UIStore = require('../../stores/ui-store.js');
const urlHelper = require('../../utils/url-helper.js');

class UpdateNotification extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isUpdateAvailable: UIStore.get().isUpdateAvailable };

    this._onChange = this._onChange.bind(this);
  }

  _onChange() {
    this.setState({ isUpdateAvailable: UIStore.get().isUpdateAvailable });
  }

  _onClick() {
    // TODO: Move all URLs to some config
    urlHelper.openExternal('http://github.com/scholtzm/punk/releases');
  }

  componentDidMount() {
    UIStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    UIStore.removeChangeListener(this._onChange);
  }

  render() {
    if(!this.state.isUpdateAvailable) {
      return null;
    }

    return (
      <button className="btn btn-default pull-right" title="Update available" onClick={(e) => this._onClick(e)}>
        <i className="fa fa-rocket"></i> Update available
      </button>
    );
  }
};

module.exports = UpdateNotification;
