/**
 * Preset scenario templates for demo and testing.
 * Each scenario returns an array of task objects and a config override.
 */

const scenarios = {
  'icu-emergency-surge': {
    label: 'ICU Emergency Surge',
    description: 'High-priority critical patients flood the ICU with limited beds.',
    config: { totalResources: 8, mode: 'hospital', preemptionEnabled: true, antiStarvationEnabled: true },
    tasks: [
      { taskName: 'Critical Patient A', taskType: 'ICU', basePriority: 5, arrivalTick: 0, deadlineTick: 5,  duration: 4, resourceUnitsRequired: 2, urgency: true },
      { taskName: 'Critical Patient B', taskType: 'ICU', basePriority: 5, arrivalTick: 1, deadlineTick: 6,  duration: 3, resourceUnitsRequired: 2, urgency: true },
      { taskName: 'Stable Patient C',   taskType: 'ICU', basePriority: 2, arrivalTick: 0, deadlineTick: 20, duration: 5, resourceUnitsRequired: 1, urgency: false },
      { taskName: 'Stable Patient D',   taskType: 'ICU', basePriority: 2, arrivalTick: 0, deadlineTick: 25, duration: 6, resourceUnitsRequired: 1, urgency: false },
      { taskName: 'Moderate Patient E', taskType: 'ICU', basePriority: 3, arrivalTick: 2, deadlineTick: 10, duration: 3, resourceUnitsRequired: 2, urgency: false },
      { taskName: 'Critical Patient F', taskType: 'ICU', basePriority: 5, arrivalTick: 3, deadlineTick: 8,  duration: 2, resourceUnitsRequired: 3, urgency: true },
      { taskName: 'Stable Patient G',   taskType: 'ICU', basePriority: 1, arrivalTick: 0, deadlineTick: 30, duration: 8, resourceUnitsRequired: 1, urgency: false },
      { taskName: 'Moderate Patient H', taskType: 'ICU', basePriority: 3, arrivalTick: 4, deadlineTick: 12, duration: 4, resourceUnitsRequired: 2, urgency: false },
    ],
  },

  'balanced-normal-load': {
    label: 'Balanced Normal Load',
    description: 'Mixed priority tasks with comfortable resource availability.',
    config: { totalResources: 10, mode: 'hospital', preemptionEnabled: false, antiStarvationEnabled: true },
    tasks: [
      { taskName: 'Task Alpha',   taskType: 'routine', basePriority: 3, arrivalTick: 0, deadlineTick: 15, duration: 4, resourceUnitsRequired: 2, urgency: false },
      { taskName: 'Task Beta',    taskType: 'routine', basePriority: 4, arrivalTick: 1, deadlineTick: 12, duration: 3, resourceUnitsRequired: 2, urgency: false },
      { taskName: 'Task Gamma',   taskType: 'routine', basePriority: 2, arrivalTick: 2, deadlineTick: 20, duration: 5, resourceUnitsRequired: 1, urgency: false },
      { taskName: 'Task Delta',   taskType: 'routine', basePriority: 5, arrivalTick: 3, deadlineTick: 10, duration: 2, resourceUnitsRequired: 3, urgency: true },
      { taskName: 'Task Epsilon', taskType: 'routine', basePriority: 1, arrivalTick: 0, deadlineTick: 25, duration: 6, resourceUnitsRequired: 1, urgency: false },
      { taskName: 'Task Zeta',    taskType: 'routine', basePriority: 3, arrivalTick: 5, deadlineTick: 18, duration: 3, resourceUnitsRequired: 2, urgency: false },
    ],
  },

  'cpu-overload-stress': {
    label: 'CPU Overload Stress Test',
    description: 'More tasks than CPU slots — tests scheduler under heavy contention.',
    config: { totalResources: 8, mode: 'cloud', preemptionEnabled: true, antiStarvationEnabled: true },
    tasks: [
      { taskName: 'Job-1',  taskType: 'compute', basePriority: 4, arrivalTick: 0, deadlineTick: 8,  duration: 5, resourceUnitsRequired: 3, urgency: false },
      { taskName: 'Job-2',  taskType: 'compute', basePriority: 3, arrivalTick: 0, deadlineTick: 10, duration: 4, resourceUnitsRequired: 2, urgency: false },
      { taskName: 'Job-3',  taskType: 'compute', basePriority: 5, arrivalTick: 1, deadlineTick: 6,  duration: 3, resourceUnitsRequired: 4, urgency: true },
      { taskName: 'Job-4',  taskType: 'compute', basePriority: 2, arrivalTick: 1, deadlineTick: 15, duration: 6, resourceUnitsRequired: 2, urgency: false },
      { taskName: 'Job-5',  taskType: 'compute', basePriority: 4, arrivalTick: 2, deadlineTick: 9,  duration: 3, resourceUnitsRequired: 3, urgency: false },
      { taskName: 'Job-6',  taskType: 'compute', basePriority: 1, arrivalTick: 2, deadlineTick: 20, duration: 7, resourceUnitsRequired: 1, urgency: false },
      { taskName: 'Job-7',  taskType: 'compute', basePriority: 5, arrivalTick: 3, deadlineTick: 7,  duration: 2, resourceUnitsRequired: 2, urgency: true },
      { taskName: 'Job-8',  taskType: 'compute', basePriority: 3, arrivalTick: 4, deadlineTick: 12, duration: 4, resourceUnitsRequired: 3, urgency: false },
      { taskName: 'Job-9',  taskType: 'compute', basePriority: 2, arrivalTick: 5, deadlineTick: 18, duration: 5, resourceUnitsRequired: 2, urgency: false },
      { taskName: 'Job-10', taskType: 'compute', basePriority: 4, arrivalTick: 6, deadlineTick: 14, duration: 3, resourceUnitsRequired: 2, urgency: false },
    ],
  },

  'starvation-demo': {
    label: 'Starvation Demonstration',
    description: 'Low-priority tasks starve until aging boosts their priority.',
    config: { totalResources: 6, mode: 'hospital', preemptionEnabled: false, antiStarvationEnabled: true, agingIntervalTicks: 2, agingBoostAmount: 1 },
    tasks: [
      { taskName: 'High-P Task 1', taskType: 'critical', basePriority: 5, arrivalTick: 0, deadlineTick: 50, duration: 4, resourceUnitsRequired: 3, urgency: false },
      { taskName: 'High-P Task 2', taskType: 'critical', basePriority: 5, arrivalTick: 0, deadlineTick: 50, duration: 4, resourceUnitsRequired: 3, urgency: false },
      { taskName: 'High-P Task 3', taskType: 'critical', basePriority: 4, arrivalTick: 2, deadlineTick: 50, duration: 3, resourceUnitsRequired: 3, urgency: false },
      { taskName: 'Low-P Task A',  taskType: 'routine',  basePriority: 1, arrivalTick: 0, deadlineTick: 50, duration: 2, resourceUnitsRequired: 3, urgency: false },
      { taskName: 'Low-P Task B',  taskType: 'routine',  basePriority: 1, arrivalTick: 1, deadlineTick: 50, duration: 2, resourceUnitsRequired: 3, urgency: false },
    ],
  },

  'deadline-collapse': {
    label: 'Deadline Collapse Scenario',
    description: 'Tasks with very tight deadlines — many will be missed.',
    config: { totalResources: 6, mode: 'cloud', preemptionEnabled: true, antiStarvationEnabled: false },
    tasks: [
      { taskName: 'Urgent-1', taskType: 'realtime', basePriority: 5, arrivalTick: 0, deadlineTick: 3,  duration: 2, resourceUnitsRequired: 3, urgency: true },
      { taskName: 'Urgent-2', taskType: 'realtime', basePriority: 5, arrivalTick: 0, deadlineTick: 3,  duration: 2, resourceUnitsRequired: 3, urgency: true },
      { taskName: 'Urgent-3', taskType: 'realtime', basePriority: 4, arrivalTick: 1, deadlineTick: 4,  duration: 2, resourceUnitsRequired: 2, urgency: true },
      { taskName: 'Normal-1', taskType: 'batch',    basePriority: 3, arrivalTick: 0, deadlineTick: 5,  duration: 3, resourceUnitsRequired: 2, urgency: false },
      { taskName: 'Normal-2', taskType: 'batch',    basePriority: 2, arrivalTick: 2, deadlineTick: 6,  duration: 4, resourceUnitsRequired: 2, urgency: false },
      { taskName: 'Normal-3', taskType: 'batch',    basePriority: 3, arrivalTick: 3, deadlineTick: 7,  duration: 3, resourceUnitsRequired: 3, urgency: false },
    ],
  },
};

module.exports = scenarios;
