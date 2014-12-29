var React = require('react');
var assign = require('object-assign');

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
    var username = this.props.params.username;

    GithubApi.get('users', username, (err, result) => {
      this.setState(result);
    })

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

      this.setState(assign({}, this.state, {
        streak: streak,
        commits: commits,
        today: today
      }));
    });
  }
});

module.exports = Profile;
