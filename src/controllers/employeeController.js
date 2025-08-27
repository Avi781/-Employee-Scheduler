const Employee = require('../models/Employee');
const Location = require('../models/Location');
const Shift = require('../models/Shift');
const MESSAGES = require('../util/message');

async function createEmployee(req, res) {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({ ok: true, message: MESSAGES.SUCCESS.EMPLOYEE.EMPLOYEE_CREATED.message, data: employee });
  } catch (e) { res.status(400).json({ error: e.message }); }
}

async function listEmployees(req, res) {
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 20);
  const q = {};
  const total = await Employee.countDocuments(q);
  const data = await Employee.find(q).skip((page - 1) * limit).limit(limit).lean();
  res.json({ ok: true,  message: MESSAGES.SUCCESS.EMPLOYEE.EMPLOYEE_DATA_FOUND.message, data, page, limit, total });
}

module.exports = { createEmployee, listEmployees };
