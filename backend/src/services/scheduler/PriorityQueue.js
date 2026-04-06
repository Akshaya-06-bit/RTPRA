/**
 * MinHeap-based Priority Queue for the scheduler.
 *
 * Comparison key: lower value = higher scheduling priority.
 * We invert effectivePriority so that higher priority number = lower heap key.
 *
 * Heap key formula (lower = scheduled first):
 *   key = -effectivePriority * 1e9 + deadlineTick * 1e4 + arrivalTick
 *
 * This gives us:
 *   1. Primary   : highest effectivePriority wins
 *   2. Secondary : earliest deadline wins (EDF)
 *   3. Tertiary  : earliest arrival wins (FCFS tie-break)
 */
class PriorityQueue {
  constructor() {
    this._heap = [];
  }

  get size() {
    return this._heap.length;
  }

  isEmpty() {
    return this._heap.length === 0;
  }

  _key(task) {
    return -task.effectivePriority * 1e9 + task.deadlineTick * 1e4 + task.arrivalTick;
  }

  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this._key(this._heap[parent]) <= this._key(this._heap[i])) break;
      this._swap(i, parent);
      i = parent;
    }
  }

  _siftDown(i) {
    const n = this._heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this._key(this._heap[l]) < this._key(this._heap[smallest])) smallest = l;
      if (r < n && this._key(this._heap[r]) < this._key(this._heap[smallest])) smallest = r;
      if (smallest === i) break;
      this._swap(i, smallest);
      i = smallest;
    }
  }

  enqueue(task) {
    this._heap.push(task);
    this._bubbleUp(this._heap.length - 1);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const top = this._heap[0];
    const last = this._heap.pop();
    if (this._heap.length > 0) {
      this._heap[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  peek() {
    return this._heap[0] ?? null;
  }

  /** Re-heapify after an in-place priority update (aging). O(n) but called infrequently. */
  rebuildHeap() {
    for (let i = Math.floor(this._heap.length / 2) - 1; i >= 0; i--) {
      this._siftDown(i);
    }
  }

  /** Remove a specific task by id. O(n). */
  remove(taskId) {
    const idx = this._heap.findIndex(t => String(t._id) === String(taskId));
    if (idx === -1) return null;
    const removed = this._heap[idx];
    const last = this._heap.pop();
    if (idx < this._heap.length) {
      this._heap[idx] = last;
      this._bubbleUp(idx);
      this._siftDown(idx);
    }
    return removed;
  }

  toArray() {
    return [...this._heap];
  }
}

module.exports = PriorityQueue;
