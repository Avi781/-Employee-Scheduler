const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth, authorize } = require('../middleware/auth');

router.get('/coverage', auth, authorize(['admin','manager']), analyticsController.coverage);

module.exports = router;
