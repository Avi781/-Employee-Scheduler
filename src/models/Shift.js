const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShiftSchema = new Schema({
  date: { type: Date, required: true, index: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  startMin: { type: Number, required: true },
  endMin: { type: Number, required: true },
  location: { type: Schema.Types.ObjectId, ref: 'Location', index: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', index: true },
  requiredSkills: [{ type: String }],
  headcount: { type: Number, default: 1 },
  assignedEmployees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
  templateId: { type: Schema.Types.ObjectId, ref: 'RecurringTemplate', default: null }
}, { timestamps: true });

ShiftSchema.index({ date: 1, location: 1, team: 1 });
ShiftSchema.index({ assignedEmployees: 1 });

module.exports = mongoose.model('Shift', ShiftSchema);
