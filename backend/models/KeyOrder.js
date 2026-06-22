const mongoose = require('mongoose');

const keyOrderSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, lowercase: true },
  phone:     { type: String },
  address:   { type: String, required: true },
  unit:      { type: String },
  keyType:   { type: String, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  reason:    { type: String },
  status:    { type: String, enum: ['pending', 'approved', 'delivered'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('KeyOrder', keyOrderSchema);
