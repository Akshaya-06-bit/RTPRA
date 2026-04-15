const engineManager = require('../services/engineManager');
const scenarios = require('../services/scheduler/scenarios');
const { computeEffectivePriority } = require('../services/scheduler/policies');

exports.startSimulation = (req, res) => {
   const engine = engineManager.getEngine(req.user._id.toString());
  const { config } = req.body;
  if (config) engine.configure(config);
  engine.start();
  res.json({ success: true, message: 'Simulation started', state: engine.getSnapshot() });
};

exports.pauseSimulation = (req, res) => {
   const engine = engineManager.getEngine(req.user._id.toString());
  engine.pause();
  res.json({ success: true, message: 'Simulation paused' });
};

exports.resumeSimulation = (req, res) => {
   const engine = engineManager.getEngine(req.user._id.toString());
  engine.resume();
  res.json({ success: true, message: 'Simulation resumed' });
};

exports.resetSimulation = (req, res) => {
   const engine = engineManager.getEngine(req.user._id.toString());
  engine.reset();
  res.json({ success: true, message: 'Simulation reset' });
};

exports.getState = (req, res) => {
   const engine = engineManager.getEngine(req.user._id.toString());
  res.json({ success: true, state: engine.getSnapshot() });
};

exports.setSpeed = (req, res) => {
   const engine = engineManager.getEngine(req.user._id.toString());
  const { multiplier } = req.body;
  if (![1, 2, 5].includes(Number(multiplier))) {
    return res.status(400).json({ success: false, message: 'Speed must be 1, 2, or 5' });
  }
  engine.setSpeed(Number(multiplier));
  res.json({ success: true, message: `Speed set to ${multiplier}x` });
};

exports.loadScenario = (req, res) => {
   const engine = engineManager.getEngine(req.user._id.toString());
  const { scenarioId } = req.body;
  const scenario = scenarios[scenarioId];
  if (!scenario) {
    return res.status(404).json({ success: false, message: 'Scenario not found' });
  }

  engine.reset();
  engine.configure(scenario.config);

  // Build in-memory task objects (no DB persistence for scenarios)
  const mongoose = require('mongoose');
  for (const t of scenario.tasks) {
    const task = {
      _id:                   new mongoose.Types.ObjectId(),
      ...t,
      remainingDuration:     t.duration,
      agingBoost:            0,
      effectivePriority:     t.basePriority,
      status:                'queued',
      waitTime:              0,
      wasPreempted:          false,
      preemptionCount:       0,
      startedAtTick:         null,
      completedAtTick:       null,
    };
    task.effectivePriority = computeEffectivePriority(task, scenario.config);
    engine.addTask(task);
  }

  engine.start();
  res.json({ success: true, message: `Scenario "${scenario.label}" loaded`, state: engine.getSnapshot() });
};

exports.listScenarios = (req, res) => {
  const list = Object.entries(scenarios).map(([id, s]) => ({
    id,
    label: s.label,
    description: s.description,
  }));
  res.json({ success: true, scenarios: list });
};

exports.updateConfig = (req, res) => {
  const engine = engineManager.getEngine(req.user._id.toString());
  const { config } = req.body;

  if (!config || typeof config !== 'object') {
    return res.status(400).json({ success: false, message: 'Config object is required' });
  }

  // Block resource pool changes while simulation is actively running
  if (engine.state === 'running') {
    return res.status(409).json({
      success: false,
      message: 'Cannot update resources while simulation is running. Pause first.',
    });
  }

  // Validate totalResources if provided
  if (config.totalResources !== undefined) {
    const val = Number(config.totalResources);
    if (!Number.isInteger(val) || val < 1) {
      return res.status(400).json({
        success: false,
        message: 'totalResources must be a positive integer (minimum 1)',
      });
    }
    config.totalResources = val;
  }

  engine.configure(config);
  res.json({ success: true, message: 'Config updated', config: engine.config });
};
