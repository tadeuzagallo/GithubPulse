var React = require('react');
var GithubApi = require('../github-api');
var Navigation = require('react-router').Navigation;

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
    GithubApi.get('zen', (err, result) => {
      this.setState({
        zen: result,
        username: this.state.username
      });
    });
  },
  _onChange(event) {
    if (event.keyCode === 13) {
    } else {
      this.setState({
        zen: this.state.zen,
        username: event.target.value.trim()
      });
    }
  },
  _onKeyDown(event) {
    if (event.keyCode === 13) {
      this.transitionTo('profile', { username: this.state.username });
    }
  }
});

module.exports = Login;
