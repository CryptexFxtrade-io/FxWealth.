const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, required: true }, // e.g., "Starter", "Pro"
  amount: { type: Number, required: true },
  roi: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'active', 'completed', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
});

module.exports = mongoose.model('Investment', investmentSchema);
