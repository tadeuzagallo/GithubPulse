var React = require('react/addons');

var CSSTransitionGroup = React.addons.CSSTransitionGroup;

require('../styles/Config');

var Config = React.createClass({
  getInitialState() {
    return {
      open: false,
      active: false,
      notify: false
    };
  },
  render() {
    var panel = '';
    var overlay = '';

    if (this.state.open) {
      overlay = <div onClick={ this._togglePanel } className="config__overlay" />

      panel = (
        <div className="config__panel" key="config__panel">
          <div className="content">
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
            <div className="config__item">
              <input
                id="notify"
                className="config__startup"
                type="checkbox"
                checked={ this.state.notify }
                onChange={ this._toggleNotifications } />
              <label htmlFor="notify">Remind me to contribute</label>
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
        <img src="images/gear.svg" onClick={ this._togglePanel } className={ 'config__gear ' + this.state.open } />

        { overlay }
        <CSSTransitionGroup transitionName="panel">
          { panel }
        </CSSTransitionGroup>
      </div>
    );
  },
  componentDidMount() {
    Utils.raw('check_login()', (active) => {
      this.setState({ active: active });
    });

    Utils.fetch('dont_notify', (dontNotify) => {
      this.setState({ notify: !dontNotify });
    });
  },
  _toggleActive() {
    this.setState({ active: !this.state.active });
    Utils.raw('toggle_login()');
  },
  _toggleNotifications() {
    var notify = !this.state.notify;
    this.setState({ notify: notify });
    Utils.save('dont_notify', !notify);
  },
  _togglePanel() {
    this.setState({ open: !this.state.open });
  },
  _quit() {
    Utils.quit();
  }
});

module.exports = Config;
