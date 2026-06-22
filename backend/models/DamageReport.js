const mongoose = require('mongoose');

const damageReportSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true },
  phone:       { type: String, trim: true },
  address:     { type: String, required: true },
  unit:        { type: String },
  damageType:  { type: String, required: true },
  description: { type: String, required: true },
  urgency:     { type: String, enum: ['low', 'medium', 'high', 'emergency'], default: 'medium' },
  status:      { type: String, enum: ['submitted', 'in_progress', 'resolved'], default: 'submitted' },
  attachments: [{ type: String }],
  createdAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('DamageReport', damageReportSchema);
