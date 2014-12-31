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
            <div className="config__item">
              <input
                id="login"
                className="config__startup"
                type="checkbox"
                checked={ this.state.active }
                onChange={ this._toggleActive } />
              <label htmlFor="login">Launch at startup</label>
            </div>
            <div className="config__separator"/>
            <div className="config__item" onClick={ this._quit }>
              <span className="octicon octicon-alert config__quit"/>
              Quit Github Pulse
            </div>
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
  },
  _quit() {
    Utils.raw('quit()');
  }
});

module.exports = Config;
