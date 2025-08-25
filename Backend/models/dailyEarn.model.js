const mongoose = require('mongoose');

const dailyEarnSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User collection
    ref: 'User',
    required: true
  },
  baseAmount: {
    type: Number,
    required: true,
    min: 0
  },
  dailyProfit: {
    type: Number,
    required: true,
    min: 0
  },
  refEarn: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DailyEarn', dailyEarnSchema);
