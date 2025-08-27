const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { auth } = require('../middleware/auth');

router.get('/daily', auth, scheduleController.dailySchedule);

module.exports = router;
