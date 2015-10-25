var React = require('react');
var GithubApi = require('../github-api');

var ProfileInfo = require('./ProfileInfo.react');
var ActivityGraph = require('./ActivityGraph.react');
var Stats = require('./Stats.react');
var Config = require('./Config.react');
var pkg = require('../../package.json');

require('../styles/Profile');

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
      _fetchingUserContributions: true,
      updateAvailable: false
    };
  },
  render() {
    var className = this.state._fetchUserInfo || this.state._fetchingUserContributions ? 'rotate' : '';

    return (
      <div className="profile-container">
        <Config />
        <div className="profile-title">
          Github Pulse
        </div>
        <div className="profile">
          <ProfileInfo
            history={ this.props.history }
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
          <img
            src="images/sync.svg"
            className={ 'update__sync ' + className }
            onClick={ this._update.bind(null, true) } />
          <div className="update__last">
            <span>Last updated at:&nbsp;</span>
            <span>{ this.state.lastUpdatedAt }</span>
          </div>
          <div className={ 'version ' + this.state.updateAvailable }>
            v{ pkg.version }
            { this.state.updateAvailable ? <span className="octicon octicon-alert" onClick={ this._updateVersion }/> : "" }
          </div>
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
    this._checkForUpdates();
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
        });
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
        userContributions.lastUpdatedAt = new Date(time).toTimeString().split(' ').shift();
        if (userContributions.lastUpdatedAt !== this.state.lastUpdatedAt) {
          userContributions._fetchingUserContributions = false;
          this.setState(userContributions);
        } else {
          this.setState({ _fetchingUserContributions: false });
        }
      } else {
        Utils.contributions(username, (success, today, streak, commits) => {
          if (!success) {
            this.setState({
              _fetchingUserContributions: false,
              lastUpdatedAt: this.state.lastUpdatedAt.replace(' (offline)', '') + ' (offline)'
            });
            return;
          }

          var newState = {
            streak: streak,
            commits: commits,
            today: today,
            _fetchingUserContributions: false,
            lastUpdatedAt: new Date().toTimeString().split(' ').shift()
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
  },
  _checkForUpdates() {
    Utils.fetch('update_available', function (updateAvailable) {
      this.setState({
        updateAvailable: updateAvailable
      });
    }.bind(this));
  },
  _updateVersion() {
    Utils.raw('update()');
  }
});

module.exports = Profile;
