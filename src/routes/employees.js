const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { auth, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.post('/', auth, authorize(['admin']), [
  body('name').notEmpty(), body('email').isEmail()
], validate, employeeController.createEmployee);

router.get('/', auth, authorize(['admin','manager']), employeeController.listEmployees);

module.exports = router;
