const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName:             { type: String, required: true, trim: true },
  taskType:             { type: String, default: 'generic' },
  basePriority:         { type: Number, required: true, min: 1, max: 5 },
  effectivePriority:    { type: Number, default: null },
  arrivalTick:          { type: Number, default: 0 },
  deadlineTick:         { type: Number, required: true },
  duration:             { type: Number, required: true, min: 1 },
  remainingDuration:    { type: Number },
  resourceUnitsRequired:{ type: Number, required: true, min: 1 },
  urgency:              { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['queued', 'running', 'completed', 'missed_deadline', 'rejected'],
    default: 'queued',
  },
  waitTime:             { type: Number, default: 0 },
  startedAtTick:        { type: Number, default: null },
  completedAtTick:      { type: Number, default: null },
  wasPreempted:         { type: Boolean, default: false },
  preemptionCount:      { type: Number, default: 0 },
  agingBoost:           { type: Number, default: 0 },
  createdBy:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  simulationId:         { type: String, default: null },
}, { timestamps: true });

taskSchema.pre('save', function (next) {
  if (this.remainingDuration == null) this.remainingDuration = this.duration;
  if (this.effectivePriority == null) this.effectivePriority = this.basePriority;
  next();
});

module.exports = mongoose.model('Task', taskSchema);
