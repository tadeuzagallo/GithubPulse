var React = require('react');

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
    GithubApi.get('users', this.props.params.username, (err, result) => {
      this.setState(result);
    })
  }
});

module.exports = Profile;
