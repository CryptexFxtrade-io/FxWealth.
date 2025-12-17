const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
});

module.exports = mongoose.model('Wallet', walletSchema);
