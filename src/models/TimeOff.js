const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimeOffSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date, required: true, index: true },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending', index: true },
  reason: String
}, { timestamps: true });

TimeOffSchema.index({ employee: 1, start: 1, end: 1 });

module.exports = mongoose.model('TimeOff', TimeOffSchema);
