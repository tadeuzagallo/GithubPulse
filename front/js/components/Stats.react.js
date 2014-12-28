var React = require('react');

var Stats = React.createClass({
  render() {
    return (
      <div>
        <div>
          <h3>57</h3>
          <small>repos</small>
        </div>
        
        <div>
          <h3>34</h3>
          <small>followers</small>
        </div>

        <div>
          <h3>31</h3>
          <small>days streak</small>
        </div>
      </div>
    );
  }
});

module.exports = Stats;
