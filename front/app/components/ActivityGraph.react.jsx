var React = require('react');
var Chart = require('chart.js');

var ActivityGraph = React.createClass({
  render() {
    return (
      <canvas className="activity-graph" width="390" height="145" ref="canvas"></canvas>
    );
  },
  componentDidMount() {
    var canvas = this.refs.canvas.getDOMNode();
    var ctx = canvas.getContext('2d');
    var commits = [
      1,1,
      4,5,1,8,1,1,4,
      2,10,3,2,8,20,3,
      13,8,1,7,20,11,1,
      2,8,10,1,3,5,6
    ];
    var labels = [];
    var max = commits.reduce(function (a, b) {
      labels.push('');
      return Math.max(a, b);
    }, 0);
    var step = Math.ceil(max / 2);
    new Chart(ctx).Line({
      labels: labels,
      datasets: [{
        label: 'Commits',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
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
