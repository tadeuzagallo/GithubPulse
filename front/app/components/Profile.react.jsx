var React = require('react');
var GithubApi = require('../github-api');
var Utils = require('../utils');

var ProfileInfo = require('./ProfileInfo.react');
var ActivityGraph = require('./ActivityGraph.react');
var Stats = require('./Stats.react');

var Profile = React.createClass({
  getInitialState() {
    return {
      avatar_url: 'https://secure.gravatar.com/avatar?size=100',
      login: '',
      name: '',
      public_repos: 0,
      followers: 0,
      streak: 0,
      today: 0,
      commits: []
    };
  },
  render() {
    return (
      <div>
        <ProfileInfo
          picture={ this.state.avatar_url }
          name={ this.state.name }
          username={ this.state.login } />
        <ActivityGraph commits={ this.state.commits } />
        <Stats
          repos={ this.state.public_repos }
          followers={ this.state.followers }
          streak={ this.state.streak }
          today={ this.state.today } />
      </div>
    );
  },
  componentWillMount() {
    this._fetchUserInfo();
    this._fetchUserContributions();
  },
  _fetchUserInfo(force) {
    var username = this.props.params.username;
    var userInfo = force ? false : Utils.fetch(['user_info', username], 15*60*1000);

    if (userInfo) {
      this.setState(userInfo);
    } else {
      GithubApi.get('users', username, (err, result) => {
        Utils.save(['user_info', username], result);
        this.setState(result);
      })
    }

  },
  _fetchUserContributions(force) {
    var username = this.props.params.username;
    var userContributions = force ? false : Utils.fetch(['user_contributions', username], 15*60*1000);

    if (userContributions) {
      this.setState(userContributions);
    } else {
      GithubApi.contributions(username, (err, contributions) => {
        var svg = document.createElement('svg');
        svg.innerHTML = contributions;
        var year = [].map.call(svg.getElementsByTagName('rect'), (r) => parseInt(r.getAttribute('data-count'), 10));
        var l = year.length - 1;
        var today = year[l];
        var streak = today ? 1 : 0;
        var commits = year.slice(-30);
        for (var i = l - 1; i >= 0 && year[i]; i--) {
          streak++;
        }

        var newState = {
          streak: streak,
          commits: commits,
          today: today
        };

        Utils.save(['user_contributions', username], newState);
        this.setState(newState);
      });
    }
  }
});

module.exports = Profile;
