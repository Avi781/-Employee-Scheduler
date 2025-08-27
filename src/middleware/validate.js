const { validationResult } = require('express-validator');

function validateRequest(req,res,next){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({
      success:false,
      error: { code: 'VALIDATION_ERROR', fields: errors.array().map(e=> ({ field: e.param, message: e.msg })) }
    });
  }
  next();
}

module.exports = validateRequest;
