const router = require('express').Router();
const ctrl   = require('../controllers/simulationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/start',         ctrl.startSimulation);
router.post('/pause',         ctrl.pauseSimulation);
router.post('/resume',        ctrl.resumeSimulation);
router.post('/reset',         ctrl.resetSimulation);
router.get('/state',          ctrl.getState);
router.post('/speed',         ctrl.setSpeed);
router.post('/load-scenario', ctrl.loadScenario);
router.get('/scenarios',      ctrl.listScenarios);
router.patch('/config',       ctrl.updateConfig);

module.exports = router;
