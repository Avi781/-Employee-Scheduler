const express = require('express');
const router = express.Router();
const timeoffController = require('../controllers/timeoffController');
const { auth, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.post('/', auth, [
  body('employeeId').notEmpty(), body('startDate').notEmpty(), body('endDate').notEmpty()
], validate, timeoffController.createTimeOff);

router.patch('/approve', auth, authorize(['admin', 'manager']), timeoffController.approveTimeOffApplication);

module.exports = router;
