const Task   = require('../models/Task');
const engine = require('../services/engineInstance');

exports.createTask = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user._id };
    const task = await Task.create(data);
    // Inject into live scheduler
    engine.addTask(task.toObject());
    res.status(201).json({ success: true, task });
  } catch (err) { next(err); }
};

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id }).sort('-createdAt').limit(200);
    res.json({ success: true, tasks });
  } catch (err) { next(err); }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (err) { next(err); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) { next(err); }
};
