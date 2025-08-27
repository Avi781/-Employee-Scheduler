const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailabilitySchema = new Schema({
  dayOfWeek: { type: Number, min:0, max:6, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true }
}, { _id: false });

const EmployeeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  role: { type: String, enum: ['admin','manager','staff'], default: 'staff' },
  skills: [{ type: String, index: true }],
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team', index: true }],
  locations: [{ type: Schema.Types.ObjectId, ref: 'Location', index: true }],
  availability: [AvailabilitySchema],
  employmentType: { type: String, enum: ['full-time','part-time'], default: 'full-time' }
}, { timestamps: true });

EmployeeSchema.index({ skills: 1 });

module.exports = mongoose.model('Employee', EmployeeSchema);
