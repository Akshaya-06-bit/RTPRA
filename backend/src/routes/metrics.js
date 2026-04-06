const router = require('express').Router();
const ctrl   = require('../controllers/metricsController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/current', ctrl.getCurrentMetrics);
router.get('/charts',  ctrl.getChartData);

module.exports = router;
