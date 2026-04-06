const mongoose = require('mongoose');

const simulationConfigSchema = new mongoose.Schema({
  totalResources:       { type: Number, default: 10 },
  mode:                 { type: String, enum: ['hospital', 'cloud'], default: 'hospital' },
  preemptionEnabled:    { type: Boolean, default: true },
  antiStarvationEnabled:{ type: Boolean, default: true },
  agingIntervalTicks:   { type: Number, default: 3 },
  agingBoostAmount:     { type: Number, default: 0.5 },
  maxEffectivePriority: { type: Number, default: 10 },
  tickIntervalMs:       { type: Number, default: 1000 },
  speedMultiplier:      { type: Number, default: 1 },
  createdBy:            { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('SimulationConfig', simulationConfigSchema);
