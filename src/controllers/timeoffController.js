const TimeOff = require('../models/TimeOff');
const MESSAGES = require('../util/message');

async function createTimeOff(req, res) {
  try {
    const data = await TimeOff.create(req.body);
    res.status(201).json({ ok: true, data: data, message: MESSAGES.SUCCESS.TIMEOFF_CREATED.message });
  } catch (e) { res.status(400).json({ error: e.message }); }
}

async function approveTimeOffApplication(req, res) {
  try {
    const { requestId, status } = req.body;
    if (!requestId || !status) {
      return res.status(400).json({ error: MESSAGES.ERRORS.TIMEOFF.message });
    }
    const data = await TimeOff.findByIdAndUpdate(requestId, { status: status }, { new: true });
    if (!data) {
      return res.status(404).json({ error: MESSAGES.ERRORS.DATA_NOT_FOUND });
    }

    if (status === 'reject') {
      return res.json({ ok: true, data, code: 201, message: MESSAGES.SUCCESS.TIMEOFF_REJECTED.message });
    }

    return res.json({
      ok: true, data, code: MESSAGES.SUCCESS.TIMEOFF_APPROVED.code, message: MESSAGES.SUCCESS.TIMEOFF_APPROVED.message
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

module.exports = { createTimeOff, approveTimeOffApplication };
