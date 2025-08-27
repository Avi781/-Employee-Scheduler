const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const MESSAGES = require('../util/message');

async function register(req, res) {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: MESSAGES.ERRORS.LOGIN.EMAIL_OR_PASS_REQ });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: MESSAGES.ERRORS.LOGIN.USER_ALREADY_EXITED });
    const hash = await bcrypt.hash(password, 10);
    const emp = await Employee.create({ name: name || email, email, role: role === 'manager' ? 'manager' : 'staff' });
    const user = await User.create({ email, passwordHash: hash, role: role || 'staff', employeeRef: emp._id });
    res.json({ ok: true, userId: user._id, message: MESSAGES.SUCCESS.LOGIN.USER_CREATE_SUCCESSFULLY });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: MESSAGES.ERRORS.LOGIN.EMAIL_OR_PASS_REQ });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: MESSAGES.ERRORS.LOGIN.USER_NOT_FOUND });
    const matchPasss = await bcrypt.compare(password, user.passwordHash);
    if (!matchPasss) return res.status(401).json({ error: MESSAGES.ERRORS.LOGIN.WRONG_PASS });
    const token = jwt.sign({ id: user._id, role: user.role, employeeId: user.employeeRef }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
    res.json({ token, role: user.role, message: MESSAGES.SUCCESS.LOGIN.LOGIN_SUCCESSFULLY });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

module.exports = { register, login };
