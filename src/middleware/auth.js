const jwt = require('jsonwebtoken');

function auth(req,res,next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  }catch(e){
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function authorize(roles=[]){
  return (req,res,next)=>{
    if(!req.user) return res.status(401).json({ error: 'unauth' });
    if(!roles.includes(req.user.role)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}

module.exports = { auth, authorize };
