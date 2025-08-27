const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TeamSchema = new Schema({
  name: { type: String, required: true },
  location: { type: Schema.Types.ObjectId, ref: 'Location', index: true }
});
TeamSchema.index({ location: 1, name: 1 }, { unique: true });
module.exports = mongoose.model('Team', TeamSchema);
