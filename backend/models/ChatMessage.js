// const mongoose = require('mongoose');

// const chatMessageSchema = new mongoose.Schema({
//   sessionId:  { type: String, required: true, index: true },
//   role:       { type: String, enum: ['user', 'admin'], required: true },
//   text:       { type: String, required: true, trim: true },
//   // Visitor info (auto-captured)
//   visitorName:  { type: String, default: 'Visitor' },
//   visitorEmail: { type: String, default: '' },
//   read:         { type: Boolean, default: false },
//   createdAt:    { type: Date, default: Date.now },
// });

// // Index for quick session queries sorted by time
// chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

// module.exports = mongoose.model('ChatMessage', chatMessageSchema);

const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sessionId:    { type: String, required: true, index: true },
  role:         { type: String, enum: ['user', 'admin'], required: true },
  text:         { type: String, required: true, trim: true },
  visitorName:  { type: String, default: 'Visitor' },
  visitorEmail: { type: String, default: '' },
  // Link to the logged-in User document (null for anonymous/old messages)
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  read:         { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now },
});

chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
