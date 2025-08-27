const { body } = require('express-validator');

exports.createShift = [
  body('date').notEmpty().withMessage('date required'),
  body('start').matches(/^\d{2}:\d{2}$/).withMessage('start time HH:MM'),
  body('end').matches(/^\d{2}:\d{2}$/).withMessage('end time HH:MM'),
  body('requiredSkills').notEmpty().withMessage('requiredSkills'),
];
