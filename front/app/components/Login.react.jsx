var React = require('react');
var GithubApi = require('../github-api');

require('../styles/Login');

var Login =  React.createClass({
  getInitialState() {
    return {
      zen: ''
    };
  },
  render() {
    return this.state.zen ? (
      <div className="login">
        <div className="login__logo">
          <img src="icon.png" />
        </div>
        <div>
          <h1>Github <span className="login__blue">Pulse</span></h1>
        </div>
        <div>
          <input className="login__input" type="text" placeholder="Type your github username" />
        </div>
        <div className="login__zen">
          <div>{ this.state.zen }</div>
          <small>api.github.com/zen</small>
        </div>
      </div>
    ) : <span />;
  },
  componentWillMount() {
    GithubApi.get('zen', (err, result) => {
      this.setState({ zen: result });
    });
  }
});

module.exports = Login;
