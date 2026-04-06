const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema({
  simulationId: { type: String, required: true },
  tick:         { type: Number, required: true },
  type: {
    type: String,
    enum: ['task_added','task_started','task_completed','task_preempted',
           'task_resumed','task_missed_deadline','task_rejected',
           'priority_boosted','simulation_started','simulation_paused',
           'simulation_resumed','simulation_reset','resource_update'],
    required: true,
  },
  message:  { type: String, required: true },
  taskId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
  taskName: { type: String, default: null },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('EventLog', eventLogSchema);
