var React = require('react');

require('../styles/Config');

var Config = React.createClass({
  getInitialState() {
    return {
      open: false
    };
  },
  render() {
    var panel = '';

    if (this.state.open) {
      panel = (
        <div>
          <div onClick={ this._togglePanel } className="config__overlay" />
          <div className="config__panel">
            <input className="config__startup" type="checkbox" />
            Launch at startup
          </div>
        </div>
      );
    }

    return (
      <div className="config">
        <span onClick={ this._togglePanel } className="octicon octicon-gear config__gear" />
        { panel }
      </div>
    );
  },
  _togglePanel() {
    this.setState({ open: !this.state.open });
  }
});

module.exports = Config;
