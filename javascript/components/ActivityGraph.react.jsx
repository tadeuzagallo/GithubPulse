var React = require('react');
var Chart = require('chart.js');


require('../styles/ActivityGraph');

var ActivityGraph = React.createClass({
  propTypes: {
    commits: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
  },
  render() {
    return (
      <div className="activity-graph">
        <canvas key="activity-graph" className="activity-graph__canvas" width="390" height="145" ref="canvas" />
      </div>
    );
  },
  shouldComponentUpdate(nextProps) {
    var pc = this.props.commits || [];
    var nc = nextProps.commits || [];

    if (pc.length != nc.length) {
      return true;
    }

    for (var i = 0, l = pc.length; i < l; i++) {
      if (pc[i] !== nc[i]) {
        return true;
      }
    }

    return false;
  },
  componentDidUpdate() {
    if (this.chart) {
      this.chart.destroy();
    }

    var canvas = this.refs.canvas.getDOMNode();
    var ctx = canvas.getContext('2d');
    var commits = this.props.commits;
    var labels = [];
    var max = commits.reduce(function (a, b) {
      labels.push('');
      return Math.max(a, b);
    }, 0);
    var step = Math.ceil(max / 2);

    this.chart = new Chart(ctx).Line({
      labels: labels,
      datasets: [{
        label: 'Commits',
        fillColor: 'rgba(65,131,196,0.2)',
        strokeColor: 'rgba(65,131,196,1)',
        pointColor: 'rgba(65,131,196,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: commits
      }]
    }, {
      scaleShowVerticalLines: false,
      scaleOverride: true,
      scaleSteps: 2,
      scaleStepWidth: step,
      scaleStartValue: 0,
      scaleLabel: " <%=value%>",
      pointHitDetectionRadius: 3,
      tooltipXPadding: 10,
    });
  }
});

module.exports = ActivityGraph;
