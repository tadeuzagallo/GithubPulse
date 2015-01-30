var React = require('react');
var Router = require('react-router');
var GithubApi = require('../github-api');

var Config = require('./Config.react');
var UserLine = require('./UserLine.react');

require('../styles/Following');

var SORT_FREQ = 60;

var userSort = function (a, b) {
  return (b.streak - a.streak) || (b.today - a.today) || (a.login.localeCompare(b.login));
};

var Following = React.createClass({
  mixins: [ Router.Navigation ],
  getInitialState() {
    return {
      maxStreak: 0,
      following: false
    };
  },
  render() {
    var usersLines = (<div></div>)
      , progressBar = void 0;

    if (this.state.following) {
      usersLines = this.state.following.map( (user) => {
        return (<UserLine user={user} maxStreak={this.state.maxStreak} />);
      });

      if (this.state.updated < this.state.following.length) {
        var widthPercent = Math.round((this.state.updated / this.state.following.length) * 100);
        progressBar = (
          <div className="following-container__progress-bar">
            <div className="following-container__progress-bar-complete" style={ { width: widthPercent + '%' } } />
          </div>
        );
      }
    }

    return (
      <div className="following-container">
        <Config />
        <div className="following-profile" onClick={ this._profile }>
          My Profile
        </div>
        <div className="following-title">
          Following ({usersLines.length})
        </div>
        <div className="following">
          <div className="following__userlist">
            { usersLines }
          </div>
        </div>
        {progressBar}
      </div>
    );
  },
  componentDidMount() {
    window.update = function () {};
    this._fetchUserFollowing(false);
  },
  componentWillUnmount() {
    window.update = null;
  },
  _fetchUserFollowing(force) {
    var _this = this;
    var username = this.props.params.username;
    var arr = [];

    var getPage = function (page) {
      GithubApi.get('users', username + '/following?per_page=100&page=' + page, (err, result) => {
        arr = arr.concat(result);

        if (result.length === 100) {
          getPage(++page);
        } else {
          arr.forEach((u) => { u.streak = u.today = 0; });
          arr.sort(userSort);
          _this.setState({
            following: arr
          });
          _this._fetchContributions();
        }
      });
    };

    Utils.fetch([username, 'following'], 15*60*1000, function (following) {
      if (following) {
        _this.setState(following);
      } else {
        getPage(1);
      }
    });
  },
  _fetchContributions() {
    var _this = this;
    var updated = 0;
    this.state.following.forEach((user) => {
      Utils.contributions(user.login, (success, today, streak, commits) => {
        var isLast = (++updated === this.state.following.length);
        var following = _this.state.following;

        user.today = today;
        user.streak = streak;
        var maxStreak = Math.max(_this.state.maxStreak, user.streak);

        if (updated % SORT_FREQ === 0 || isLast) {
          following.sort(userSort);
        }

        _this.setState({
          updated: updated,
          maxStreak: maxStreak,
          following: following
        });

        if (isLast) {
          Utils.save([this.props.params.username, 'following'], {
            maxStreak: maxStreak,
            following: following
          });
        }
      }, true);
    });
  },
  _profile() {
    this.transitionTo('profile', { username: this.props.params.username });
  }
});

module.exports = Following;
