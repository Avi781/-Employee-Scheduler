const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');
const { auth, authorize } = require('../middleware/auth');
const { createShift } = require('../validators/shiftValidator');
const validate = require('../middleware/validate');

router.post('/', auth, authorize(['admin','manager']), createShift, validate, shiftController.createShift);
router.post('/assign', auth, authorize(['admin','manager']), shiftController.assignEmployees);

module.exports = router;
