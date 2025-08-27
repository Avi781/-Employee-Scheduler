const shiftService = require('../services/shiftService');
const MESSAGES = require('../util/message');

async function createShift(req, res) {
  try {
    const shift = await shiftService.createShift(req.body);
    res.status(201).json({ ok: true, data: shift, message: MESSAGES.SUCCESS.SHIFT_CREATED.message });
  } catch (e) { res.status(400).json({ error: e.message }); }
}

async function assignEmployees(req, res) {
  try {
    const { employeeId, shiftId } = req.body;
    await shiftService.assignEmployees(shiftId, employeeId);
    res.json({ ok: true, message: MESSAGES.SUCCESS.SHIFT_ASSIGNED.message });
  } catch (e) {
    if (e.code === 'TIMEOFF_CLASH' || e.code === 'DOUBLE_BOOKING') return res.status(409).json({ error: e.message, items: e.items });
    res.status(500).json({ error: e.message });
  }
}

module.exports = { createShift, assignEmployees };
