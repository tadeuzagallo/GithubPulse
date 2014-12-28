var React = require('react');

require('../styles/Stats');

var Stats = React.createClass({
  render() {
    return (
      <div className="stats">
        <div className="stat">
          <h3 className="stat__count">57</h3>
          <small>repos</small>
        </div>
        
        <div className="stat">
          <h3 className="stat__count">34</h3>
          <small>followers</small>
        </div>

        <div className="stat">
          <h3 className="stat__count">31</h3>
          <small>days streak</small>
        </div>

        <div className="stat">
          <h3 className="stat__count">4</h3>
          <small>commits today</small>
        </div>
      </div>
    );
  }
});

module.exports = Stats;
