var React = require('react');
var GithubApi = require('../github-api');
var Utils = require('../utils');

var ProfileInfo = require('./ProfileInfo.react');
var ActivityGraph = require('./ActivityGraph.react');
var Stats = require('./Stats.react');

require('../styles/Profile')

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
      lastUpdatedAt: '',
      commits: []
    };
  },
  render() {
    return (
      <div>
        <div className="profile">
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
        <div className="update">
          <span className="octicon octicon-sync" onClick={ this._update.bind(null, true) } />
          &nbsp;
          <small>
            <span>last updated at:</span>
            <strong>{ this.state.lastUpdatedAt }</strong>
          </small>
        </div>
      </div>
    );
  },
  componentDidMount() {
    this._update(false);
  },
  _update(force) {
    this._fetchUserInfo(force);
    setTimeout(_=> this._fetchUserContributions(force), 1)
  },
  _fetchUserInfo(force) {
    var username = this.props.params.username;

    var callback = (userInfo) => {
      if (userInfo) {
        this.setState(userInfo);
      } else {
        GithubApi.get('users', username, (err, result) => {
          Utils.save(['user_info', username], result);
          this.setState(result);
        })
      }
    };

    if (force) {
      callback(false);
    } else {
      window.location = 'log:fetching user info from cache';
      Utils.fetch(['user_info', username], 15*60*1000, callback);
    }
  },
  _fetchUserContributions(force) {
    var username = this.props.params.username;

    var callback = (userContributions, time) => {
      if (userContributions) {
        userContributions.lastUpdatedAt = new Date(time).toLocaleString();
        this.setState(userContributions);
      } else {
        window.location = 'log:requesting contributions';
        GithubApi.contributions(username, (today, streak, commits, time) => {
          var newState = {
            streak: streak,
            commits: commits,
            today: today,
            lastUpdatedAt: new Date().toLocaleString()
          };

          Utils.save(['user_contributions', username], newState);
          this.setState(newState);
        });
      }
    };

    if (force) {
      callback(false);
    } else {
      Utils.fetch(['user_contributions', username], 15*60*1000, callback);
    }
  }
});

module.exports = Profile;
