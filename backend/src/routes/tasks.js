const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/errorHandler');

const taskValidation = [
  body('taskName').trim().notEmpty().withMessage('Task name required'),
  body('basePriority').isInt({ min: 1, max: 5 }).withMessage('Priority must be 1-5'),
  body('deadlineTick').isInt({ min: 1 }).withMessage('Deadline tick must be positive'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1'),
  body('resourceUnitsRequired').isInt({ min: 1 }).withMessage('Resource units must be at least 1'),
];

router.use(protect);

router.route('/')
  .get(ctrl.getTasks)
  .post(taskValidation, validate, ctrl.createTask);

router.route('/:id')
  .get(ctrl.getTask)
  .patch(ctrl.updateTask)
  .delete(ctrl.deleteTask);

module.exports = router;
