/**
 * Singleton scheduler engine instance shared across the app.
 */
const SchedulerEngine = require('./scheduler/SchedulerEngine');

const engine = new SchedulerEngine();

module.exports = engine;
