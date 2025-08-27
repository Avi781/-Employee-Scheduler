const analyticsService = require('../services/analyticsService');
const MESSAGES = require('../util/message');

async function coverage(req, res) {
  try {
    const { date, locationId } = req.query;
    if (!date) return res.status(400).json({ error: MESSAGES.ERRORS.COVERAGE.message });
    const result = await analyticsService.coverageByRole(date, locationId);
    res.json({ ok: true, date, locationId, ...result });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

module.exports = { coverage };
