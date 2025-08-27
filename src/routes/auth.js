const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { register, login } = require('../validators/authValidator');
const validate = require('../middleware/validate');

router.post('/register', register, validate, authController.register);
router.post('/login', login, validate, authController.login);

module.exports = router;
