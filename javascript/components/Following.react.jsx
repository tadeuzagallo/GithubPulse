var React = require('react');
var Router = require('react-router');
var async = require('async');
var GithubApi = require('../github-api');

var Config = require('./Config.react');
var UserLine = require('./UserLine.react');

require('../styles/Following')

var Following = React.createClass({
  mixins: [ Router.Navigation ],
  getInitialState() {
    return {
      maxStreak: 0,
      following: false,
    };
  },
  render() {
    var usersLines = (<div></div>);

    if (this.state.following) {
      usersLines = this.state.following.map( (user) => {
        return (<UserLine user={user} maxStreak={this.state.maxStreak} />);
      });
    }

    return (
      <div className="following-container">
        <Config />
        <div className="following-profile" onClick={ this._profile }>
          My Profile
        </div>
        <div className="following-title">
          Following
        </div>
        <div className="following">
          <div className="following__userlist">
            { usersLines }
          </div>
        </div>
      </div>
    );
  },
  componentDidMount() {
    this._fetchUserFollowing(false);
  },
  _fetchUserFollowing(force) {
    var _this = this;
    var username = this.props.params.username;

    GithubApi.get('users', username + '/following?per_page=100', (err, result) => {
      result.sort((a, b) => { return a.login.localeCompare(b.login); });
      _this.state.following = result;
      _this.setState(_this.state);
      _this._fetchContributions();
    });
  },
  _fetchContributions() {
    var _this = this;
    async.eachSeries(_this.state.following, (user, callback) => {
      Utils.contributionsForOthers(user.login, (success, today, streak, commits) => {
        user.today = today;
        user.streak = streak;
        _this.state.maxStreak = Math.max(_this.state.maxStreak, user.streak);
        _this.setState(_this.state);
        callback();
      });
    });
  },
  _profile() {
    this.transitionTo('profile', { username: this.props.params.username });
  }
});

module.exports = Following;
