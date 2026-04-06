const engine = require('../services/engineInstance');

exports.getCurrentMetrics = (req, res) => {
  const snapshot = engine.getSnapshot();
  res.json({
    success: true,
    metrics: snapshot.metrics,
    resources: snapshot.resources,
    currentTick: snapshot.currentTick,
  });
};

exports.getChartData = (req, res) => {
  const snapshot = engine.getSnapshot();
  res.json({ success: true, chartData: snapshot.chartData });
};
