var React = require('react');
var assign = require('object-assign');

var GithubApi = require('../github-api');
var Config = require('./Config.react');

require('../styles/Login');

var Login =  React.createClass({
  getInitialState() {
    return {
      username: '',
      zen: ''
    };
  },
  render() {
    return (
      <div>
        <Config />
        <div className="login">
          <div className="login__logo">
            <img src="images/icon.png" />
          </div>
          <div>
            <h1>Github <span className="login__blue">Pulse</span></h1>
          </div>
          <div>
            <input value={ this.state.username } onChange={ this._onChange } onKeyDown={ this._onKeyDown } className="login__input" type="text" placeholder="Type your github username" />
          </div>
          <div className="login__zen">
            <div>{ this.state.zen }</div>
            <small>api.github.com/zen</small>
          </div>
        </div>
      </div>
    );
  },
  componentDidMount() {
    this._fetchZen();
    this._fetchUserName();
  },
  _fetchZen() {
    Utils.fetch('zen', 60 * 60 * 1000, (zen) => {
      if (zen) {
        this.setState({ zen: zen });
      } else {
        GithubApi.get('zen', (err, result) => {
          this.setState({ zen: result });
          Utils.save('zen', result);
        });
      }
    });
  },
  _fetchUserName() {
    Utils.fetch('username', (username) => {
      if (username) {
        this.props.history.pushState(null, `/${username}`);
      }
    });
  },
  _onChange(event) {
    this.setState({ username: event.target.value.trim() });
  },
  _onKeyDown(event) {
    if (event.keyCode === 13) {
      let username = this.state.username;
      Utils.save('username', username);
      this.props.history.pushState(null, `/${username}`);
    }
  }
});

module.exports = Login;
