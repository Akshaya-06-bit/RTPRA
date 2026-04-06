/**
 * Metrics tracker for a simulation run.
 * Maintains time-series snapshots and aggregate counters.
 */
class MetricsTracker {
  constructor() {
    this.reset();
  }

  reset() {
    this.totalTasksAdded      = 0;
    this.totalCompleted       = 0;
    this.totalMissedDeadlines = 0;
    this.totalRejected        = 0;
    this.totalPreemptions     = 0;
    this.starvationPrevented  = 0; // tasks whose aging boost helped them get scheduled
    this.totalWaitTime        = 0;
    this.completedTaskCount   = 0; // for avg wait time denominator
    this.utilizationHistory   = []; // [{ tick, utilization }]
    this.completedHistory     = []; // [{ tick, count }]
    this.missedHistory        = []; // [{ tick, count }]
    this.throughputHistory    = []; // [{ tick, throughput }]
  }

  recordSnapshot(tick, usedResources, totalResources) {
    const utilization = totalResources > 0 ? (usedResources / totalResources) * 100 : 0;
    this.utilizationHistory.push({ tick, utilization: Math.round(utilization * 10) / 10 });
    this.completedHistory.push({ tick, count: this.totalCompleted });
    this.missedHistory.push({ tick, count: this.totalMissedDeadlines });
    // throughput = completed tasks in last snapshot window (simplified: cumulative)
    this.throughputHistory.push({ tick, throughput: this.totalCompleted });
  }

  recordTaskAdded()          { this.totalTasksAdded++; }
  recordCompleted(waitTime)  { this.totalCompleted++; this.totalWaitTime += waitTime; this.completedTaskCount++; }
  recordMissedDeadline()     { this.totalMissedDeadlines++; }
  recordRejected()           { this.totalRejected++; }
  recordPreemption()         { this.totalPreemptions++; }
  recordStarvationPrevented(){ this.starvationPrevented++; }

  get averageWaitTime() {
    return this.completedTaskCount > 0
      ? Math.round((this.totalWaitTime / this.completedTaskCount) * 10) / 10
      : 0;
  }

  getSummary() {
    return {
      totalTasksAdded:      this.totalTasksAdded,
      totalCompleted:       this.totalCompleted,
      totalMissedDeadlines: this.totalMissedDeadlines,
      totalRejected:        this.totalRejected,
      totalPreemptions:     this.totalPreemptions,
      starvationPrevented:  this.starvationPrevented,
      averageWaitTime:      this.averageWaitTime,
    };
  }

  getChartData() {
    return {
      utilizationHistory:  this.utilizationHistory.slice(-60),
      completedHistory:    this.completedHistory.slice(-60),
      missedHistory:       this.missedHistory.slice(-60),
      throughputHistory:   this.throughputHistory.slice(-60),
    };
  }
}

module.exports = MetricsTracker;
