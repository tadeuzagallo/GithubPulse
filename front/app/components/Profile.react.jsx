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
      commits: [],
      _fetchingUserInfo: true,
      _fetchingUserContributions: true
    };
  },
  render() {
    var className = this.state._fetchUserInfo || this.state._fetchingUserContributions ? 'rotate' : '';

    return (
      <div className="profile-container">
        <div className="profile-title">
          Github Pulse
        </div>
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
          <span
            className={ 'octicon octicon-sync ' + className }
            onClick={ this._update.bind(null, true) } />
          &nbsp;
          <small>
            <span>Last updated at:&nbsp;</span>
            <strong>{ this.state.lastUpdatedAt }</strong>
          </small>
        </div>
      </div>
    );
  },
  componentDidMount() {
    window.update = this._update;
    this._update(false);
  },
  componentWillUnmount() {
    window.update = null;
  },
  _update(force) {
    this.setState({
      _fetchingUserInfo: true,
      _fetchingUserContributions: true
    });

    this._fetchUserInfo(force);
    this._fetchUserContributions(force);
  },
  _fetchUserInfo(force) {
    var username = this.props.params.username;

    var callback = (userInfo) => {
      if (userInfo) {
        if (userInfo.updated_at !== this.state.updated_at) {
          userInfo._fetchUserInfo = false;
          this.setState(userInfo);
        }
      } else {
        GithubApi.get('users', username, (err, result) => {
          Utils.save(['user_info', username], result);
          result._fetchUserInfo = false;
          this.setState(result);
        })
      }
    };

    if (force) {
      callback(false);
    } else {
      Utils.fetch(['user_info', username], 15*60*1000, callback);
    }
  },
  _fetchUserContributions(force) {
    var username = this.props.params.username;

    var callback = (userContributions, time) => {
      if (userContributions) {
        userContributions.lastUpdatedAt = new Date(time).toLocaleString();
        if (userContributions.lastUpdatedAt !== this.state.lastUpdatedAt) {
          userContributions._fetchingUserContributions = false;
          this.setState(userContributions);
        } else {
          this.setState({ _fetchingUserContributions: false });
        }
      } else {
        GithubApi.contributions(username, (today, streak, commits, time) => {
          var newState = {
            streak: streak,
            commits: commits,
            today: today,
            _fetchingUserContributions: false,
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
