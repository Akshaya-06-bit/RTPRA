const SchedulerEngine = require('./scheduler/SchedulerEngine');

class EngineManager {
  constructor() {
    this.engines = new Map(); // key = userId, value = SchedulerEngine instance
  }

  getEngine(userId) {
    if (!this.engines.has(userId)) {
      const engine = new SchedulerEngine();
      this.engines.set(userId, engine);
    }
    return this.engines.get(userId);
  }

  removeEngine(userId) {
    const engine = this.engines.get(userId);
    if (engine) {
      engine.reset();
      this.engines.delete(userId);
    }
  }
}

module.exports = new EngineManager();