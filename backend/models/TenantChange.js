const mongoose = require('mongoose');

const tenantChangeSchema = new mongoose.Schema({
  property:       { type: String, required: true },
  unit:           { type: String, required: true },
  outgoingTenant: { name: String, email: String, moveOutDate: Date },
  incomingTenant: { name: String, email: String, moveInDate: Date },
  ownerName:      { type: String, required: true },
  ownerEmail:     { type: String, required: true, lowercase: true },
  notes:          { type: String },
  status:         { type: String, enum: ['submitted', 'processing', 'completed'], default: 'submitted' },
  createdAt:      { type: Date, default: Date.now },
});

module.exports = mongoose.model('TenantChange', tenantChangeSchema);
