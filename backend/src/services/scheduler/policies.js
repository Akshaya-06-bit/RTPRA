/**
 * Scheduling policies and helper calculations.
 */

const URGENCY_BONUS = 1.5;

/**
 * Compute effective priority for a task.
 * effectivePriority = basePriority + agingBoost + urgencyBonus
 * Capped at maxEffectivePriority.
 */
function computeEffectivePriority(task, config) {
  const urgencyBonus = task.urgency ? URGENCY_BONUS : 0;
  const raw = task.basePriority + (task.agingBoost || 0) + urgencyBonus;
  return Math.min(raw, config.maxEffectivePriority);
}

/**
 * Apply aging to all queued tasks.
 * Every agingIntervalTicks ticks of waiting, boost effectivePriority by agingBoostAmount.
 * Returns list of tasks whose priority was boosted (for event logging).
 */
function applyAging(queuedTasks, currentTick, config) {
  const boosted = [];
  for (const task of queuedTasks) {
    const waitedTicks = currentTick - task.arrivalTick;
    const intervals = Math.floor(waitedTicks / config.agingIntervalTicks);
    const newBoost = intervals * config.agingBoostAmount;
    if (newBoost > task.agingBoost) {
      task.agingBoost = newBoost;
      const prev = task.effectivePriority;
      task.effectivePriority = computeEffectivePriority(task, config);
      if (task.effectivePriority > prev) boosted.push({ task, prev, next: task.effectivePriority });
    }
  }
  return boosted;
}

/**
 * Feasibility check: can this task possibly finish before its deadline?
 * Assumes it could start right now with currentTick.
 */
function isFeasible(task, currentTick) {
  return currentTick + task.remainingDuration <= task.deadlineTick;
}

/**
 * Find the lowest-priority running task that could be preempted
 * to free enough resources for the candidate task.
 * Returns array of tasks to preempt (may be multiple for multi-unit tasks).
 */
function findPreemptionCandidates(runningTasks, candidateTask) {
  // Sort running tasks by effectivePriority ascending (lowest first)
  const sorted = [...runningTasks].sort((a, b) => a.effectivePriority - b.effectivePriority);
  const candidates = [];
  let freed = 0;
  for (const t of sorted) {
    if (t.effectivePriority >= candidateTask.effectivePriority) break;
    candidates.push(t);
    freed += t.resourceUnitsRequired;
    if (freed >= candidateTask.resourceUnitsRequired) return candidates;
  }
  return []; // not enough lower-priority tasks to preempt
}

module.exports = { computeEffectivePriority, applyAging, isFeasible, findPreemptionCandidates };
