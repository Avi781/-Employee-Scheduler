const { body } = require('express-validator');
exports.register = [
  body('email').isEmail().withMessage('valid email required'),
  body('password').isLength({ min:6 }).withMessage('password min 6'),
];
exports.login = [
  body('email').isEmail().withMessage('valid email required'),
  body('password').notEmpty().withMessage('password required'),
];
