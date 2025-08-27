const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','manager','staff'], default: 'staff' },
  employeeRef: { type: Schema.Types.ObjectId, ref: 'Employee' }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
