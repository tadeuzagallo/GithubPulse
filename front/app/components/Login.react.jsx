var React = require('react');
var Navigation = require('react-router').Navigation;
var assign = require('object-assign');
var Utils = require('../utils');
var GithubApi = require('../github-api');

require('../styles/Login');

var Login =  React.createClass({
  mixins: [ Navigation ],
  getInitialState() {
    return {
      username: '',
      zen: ''
    };
  },
  render() {
    return (
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
    );
  },
  componentWillMount() {
    var zen = Utils.fetch('zen', 60 * 60 * 1000);

    if (zen) {
      this._update({ zen: zen });
    } else {
      GithubApi.get('zen', (err, result) => {
        Utils.save('zen', result);
        this._update({ zen: zen });
      });
    }
  },
  componentDidMount() {
    var username = Utils.fetch('username');
    if (username) {
      this.transitionTo('profile', { username: username });
    }
  },
  _update(object) {
    this.setState(assign({}, this.state, object));
  },
  _onChange(event) {
    this._update({ username: event.target.value.trim() });
  },
  _onKeyDown(event) {
    if (event.keyCode === 13) {
      this.transitionTo('profile', { username: this.state.username });
    }
  }
});

module.exports = Login;
