var React = require('react');
var Utils = require('../utils');

require('../styles/Config');

var Config = React.createClass({
  getInitialState() {
    return {
      open: false,
      active: false
    };
  },
  render() {
    var panel = '';

    if (this.state.open) {
      panel = (
        <div>
          <div onClick={ this._togglePanel } className="config__overlay" />
          <div className="config__panel">
            <input
              className="config__startup"
              type="checkbox"
              checked={ this.state.active }
              onChange={ this._toggleActive } />
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
  componentDidMount() {
    Utils.raw('check_login()', (active) => {
      this.setState({ active: active });
    });
  },
  _toggleActive() {
    this.setState({ active: !this.state.active });
    Utils.raw('toggle_login()');
  },
  _togglePanel() {
    this.setState({ open: !this.state.open });
  }
});

module.exports = Config;
