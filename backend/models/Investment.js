const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, required: true }, // e.g., "Bronze", "Silver", "Gold"
    amount: { type: Number, required: true },
    roi: { type: Number, required: true }, // Admin sets ROI %
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'rejected'],
      default: 'pending',
    },
    startDate: { type: Date },
    endDate: { type: Date },
    profit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Investment', InvestmentSchema);
