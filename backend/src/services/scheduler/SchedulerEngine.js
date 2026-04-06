/**
 * SchedulerEngine — core simulation loop.
 *
 * Lifecycle:
 *   engine.configure(config)
 *   engine.addTask(task)        — can be called at any time
 *   engine.start()              — begins tick loop
 *   engine.pause() / resume()
 *   engine.reset()
 *
 * Each tick:
 *   1. Age queued tasks (anti-starvation)
 *   2. Advance running tasks (decrement remainingDuration)
 *   3. Complete finished tasks, release resources
 *   4. Mark deadline-missed tasks
 *   5. Attempt to schedule queued tasks (with optional preemption)
 *   6. Emit state snapshot via onTick callback
 */

const PriorityQueue       = require('./PriorityQueue');
const MetricsTracker      = require('./metrics');
const { applyAging, isFeasible, findPreemptionCandidates, computeEffectivePriority } = require('./policies');

const DEFAULT_CONFIG = {
  totalResources:        10,
  mode:                  'hospital',
  preemptionEnabled:     true,
  antiStarvationEnabled: true,
  agingIntervalTicks:    3,
  agingBoostAmount:      0.5,
  maxEffectivePriority:  10,
  tickIntervalMs:        1000,
  speedMultiplier:       1,
};

class SchedulerEngine {
  constructor() {
    this.config       = { ...DEFAULT_CONFIG };
    this.queue        = new PriorityQueue();
    this.running      = [];   // tasks currently consuming resources
    this.completed    = [];
    this.failed       = [];   // missed_deadline + rejected
    this.eventLog     = [];
    this.metrics      = new MetricsTracker();
    this.currentTick  = 0;
    this.usedResources= 0;
    this.state        = 'idle'; // idle | running | paused
    this._timer       = null;
    this.onTick       = null;  // callback(snapshot) set by socket layer
    this.simulationId = null;
  }

  // ─── Configuration ────────────────────────────────────────────────────────

  configure(config) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ─── Task Management ──────────────────────────────────────────────────────

  addTask(task) {
    // Normalise task fields
    task.remainingDuration = task.remainingDuration ?? task.duration;
    task.agingBoost        = task.agingBoost ?? 0;
    task.effectivePriority = computeEffectivePriority(task, this.config);
    task.status            = 'queued';
    task.waitTime          = 0;

    this.queue.enqueue(task);
    this.metrics.recordTaskAdded();
    this._log('task_added', `Task "${task.taskName}" added to queue (priority ${task.basePriority}, deadline tick ${task.deadlineTick})`, task);
    this._broadcastState();
  }

  // ─── Simulation Controls ──────────────────────────────────────────────────

  start(simulationId) {
    if (this.state === 'running') return;
    this.simulationId = simulationId || `sim_${Date.now()}`;
    this.state = 'running';
    this._log('simulation_started', 'Simulation started');
    this._scheduleTick();
  }

  pause() {
    if (this.state !== 'running') return;
    this.state = 'paused';
    clearTimeout(this._timer);
    this._log('simulation_paused', `Simulation paused at tick ${this.currentTick}`);
    this._broadcastState();
  }

  resume() {
    if (this.state !== 'paused') return;
    this.state = 'running';
    this._log('simulation_resumed', `Simulation resumed at tick ${this.currentTick}`);
    this._scheduleTick();
  }

  reset() {
    clearTimeout(this._timer);
    this.queue        = new PriorityQueue();
    this.running      = [];
    this.completed    = [];
    this.failed       = [];
    this.eventLog     = [];
    this.metrics      = new MetricsTracker();
    this.currentTick  = 0;
    this.usedResources= 0;
    this.state        = 'idle';
    this._timer       = null;
    this.simulationId = null;
    this._log('simulation_reset', 'Simulation reset');
    this._broadcastState();
  }

  setSpeed(multiplier) {
    this.config.speedMultiplier = multiplier;
    if (this.state === 'running') {
      clearTimeout(this._timer);
      this._scheduleTick();
    }
  }

  // ─── Core Tick ────────────────────────────────────────────────────────────

  _scheduleTick() {
    const interval = Math.max(100, this.config.tickIntervalMs / this.config.speedMultiplier);
    this._timer = setTimeout(() => this._tick(), interval);
  }

  _tick() {
    if (this.state !== 'running') return;
    this.currentTick++;

    // 1. Age queued tasks
    if (this.config.antiStarvationEnabled) {
      const boosted = applyAging(this.queue.toArray(), this.currentTick, this.config);
      if (boosted.length > 0) {
        this.queue.rebuildHeap();
        for (const { task, prev, next } of boosted) {
          this._log('priority_boosted',
            `Task "${task.taskName}" priority boosted by aging: ${prev.toFixed(1)} → ${next.toFixed(1)}`, task);
          this.metrics.recordStarvationPrevented();
        }
      }
    }

    // 2. Advance running tasks
    for (const task of this.running) {
      task.remainingDuration--;
      task.waitTime = (task.startedAtTick != null)
        ? task.startedAtTick - task.arrivalTick
        : task.waitTime;
    }

    // 3. Complete finished tasks
    const stillRunning = [];
    for (const task of this.running) {
      if (task.remainingDuration <= 0) {
        task.status         = 'completed';
        task.completedAtTick= this.currentTick;
        this.usedResources -= task.resourceUnitsRequired;
        this.completed.push(task);
        this.metrics.recordCompleted(task.waitTime);
        this._log('task_completed', `Task "${task.taskName}" completed at tick ${this.currentTick}`, task);
      } else {
        stillRunning.push(task);
      }
    }
    this.running = stillRunning;

    // 4. Mark deadline misses in queue
    const queueArray = this.queue.toArray();
    const missed = queueArray.filter(t => t.deadlineTick < this.currentTick);
    for (const task of missed) {
      this.queue.remove(task._id);
      task.status = 'missed_deadline';
      this.failed.push(task);
      this.metrics.recordMissedDeadline();
      this._log('task_missed_deadline', `Task "${task.taskName}" missed its deadline (tick ${task.deadlineTick})`, task);
    }

    // 5. Schedule queued tasks
    this._scheduleEligible();

    // 6. Record metrics snapshot
    this.metrics.recordSnapshot(this.currentTick, this.usedResources, this.config.totalResources);

    // 7. Broadcast
    this._broadcastState();
    this._scheduleTick();
  }

  _scheduleEligible() {
    const available = this.config.totalResources - this.usedResources;
    if (available <= 0 && !this.config.preemptionEnabled) return;

    // Drain queue greedily — try to schedule as many tasks as possible
    let attempts = this.queue.size;
    const deferred = [];

    while (attempts-- > 0 && !this.queue.isEmpty()) {
      const task = this.queue.dequeue();

      // Feasibility check
      if (!isFeasible(task, this.currentTick)) {
        task.status = 'missed_deadline';
        this.failed.push(task);
        this.metrics.recordMissedDeadline();
        this._log('task_missed_deadline', `Task "${task.taskName}" is no longer feasible — marked missed`, task);
        continue;
      }

      const avail = this.config.totalResources - this.usedResources;

      if (task.resourceUnitsRequired <= avail) {
        // Enough resources — start immediately
        this._startTask(task);
      } else if (this.config.preemptionEnabled) {
        // Try preemption
        const candidates = findPreemptionCandidates(this.running, task);
        if (candidates.length > 0) {
          for (const victim of candidates) {
            this._preemptTask(victim);
          }
          this._startTask(task);
        } else {
          deferred.push(task);
        }
      } else {
        deferred.push(task);
      }
    }

    // Re-enqueue deferred tasks
    for (const t of deferred) this.queue.enqueue(t);
  }

  _startTask(task) {
    const hadAgingBoost = task.agingBoost > 0;
    task.status       = 'running';
    task.startedAtTick= this.currentTick;
    task.waitTime     = this.currentTick - task.arrivalTick;
    this.usedResources += task.resourceUnitsRequired;
    this.running.push(task);
    if (hadAgingBoost) this.metrics.recordStarvationPrevented();
    this._log('task_started',
      `Task "${task.taskName}" started (EP: ${task.effectivePriority.toFixed(1)}, resources: ${task.resourceUnitsRequired})`, task);
  }

  _preemptTask(task) {
    task.status = 'queued';
    task.wasPreempted = true;
    task.preemptionCount = (task.preemptionCount || 0) + 1;
    this.usedResources -= task.resourceUnitsRequired;
    this.running = this.running.filter(t => String(t._id) !== String(task._id));
    this.queue.enqueue(task);
    this.metrics.recordPreemption();
    this._log('task_preempted',
      `Task "${task.taskName}" preempted (remaining: ${task.remainingDuration} ticks)`, task);
  }

  // ─── State Snapshot ───────────────────────────────────────────────────────

  getSnapshot() {
    return {
      simulationId:  this.simulationId,
      state:         this.state,
      currentTick:   this.currentTick,
      config:        this.config,
      resources: {
        total:     this.config.totalResources,
        used:      this.usedResources,
        available: this.config.totalResources - this.usedResources,
        utilization: this.config.totalResources > 0
          ? Math.round((this.usedResources / this.config.totalResources) * 1000) / 10
          : 0,
      },
      queue:     this.queue.toArray().map(t => this._serializeTask(t)),
      running:   this.running.map(t => this._serializeTask(t)),
      completed: this.completed.slice(-50).map(t => this._serializeTask(t)),
      failed:    this.failed.slice(-50).map(t => this._serializeTask(t)),
      eventLog:  this.eventLog.slice(-100),
      metrics:   this.metrics.getSummary(),
      chartData: this.metrics.getChartData(),
    };
  }

  _serializeTask(t) {
    return {
      _id:                  String(t._id),
      taskName:             t.taskName,
      taskType:             t.taskType,
      basePriority:         t.basePriority,
      effectivePriority:    Math.round(t.effectivePriority * 10) / 10,
      arrivalTick:          t.arrivalTick,
      deadlineTick:         t.deadlineTick,
      duration:             t.duration,
      remainingDuration:    t.remainingDuration,
      resourceUnitsRequired:t.resourceUnitsRequired,
      urgency:              t.urgency,
      status:               t.status,
      waitTime:             t.waitTime,
      startedAtTick:        t.startedAtTick,
      completedAtTick:      t.completedAtTick,
      wasPreempted:         t.wasPreempted,
      preemptionCount:      t.preemptionCount,
      agingBoost:           Math.round((t.agingBoost || 0) * 10) / 10,
    };
  }

  _log(type, message, task = null) {
    const entry = {
      id:       `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      tick:     this.currentTick,
      type,
      message,
      taskId:   task ? String(task._id) : null,
      taskName: task ? task.taskName : null,
      timestamp: new Date().toISOString(),
    };
    this.eventLog.push(entry);
    // Keep log bounded
    if (this.eventLog.length > 500) this.eventLog.shift();
  }

  _broadcastState() {
    if (typeof this.onTick === 'function') {
      this.onTick(this.getSnapshot());
    }
  }
}

module.exports = SchedulerEngine;
