const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title:       { type: String, required: true },
  type:        { type: String, enum: ['apartment_complex', 'apartment_building', 'commercial', 'mixed'], default: 'apartment_building' },
  address:     { type: String, required: true },
  city:        { type: String, required: true },
  units:       { type: Number, default: 0 },
  description: { type: String },
  image:       { type: String },
  featured:    { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('Property', propertySchema);
