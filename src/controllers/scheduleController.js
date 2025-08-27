const Shift = require('../models/Shift');
const mongoose = require('mongoose');
const MESSAGES = require('../util/message');

async function dailySchedule(req, res) {
  try {
    const { date, locationId, teamId, page = 1, limit = 20 } = req.query;
    if (!date) return res.status(400).json({ error: 'date required' });
    const d = new Date(date);
    const q = { date: d };
    if (locationId) q.location = mongoose.Types.ObjectId(locationId);
    if (teamId) q.team = mongoose.Types.ObjectId(teamId);
    const total = await Shift.countDocuments(q);
    const data = await Shift.find(q).populate('assignedEmployees', 'name skills').skip((page - 1) * limit).limit(+limit).lean();
    res.json({ ok: true, message: MESSAGES.SUCCESS.SCHEDULE_DATA_FOUND.message, data, page: +page, limit: +limit, total });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

module.exports = { dailySchedule };
