const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default:''
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  referralLevel: {
    type: Number,
    default: 0
  },
  referredUsers: [{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  refLevel: {
    type: Number,
  }
}],
  totalBalance: {
    type: Number,
    default: 0
  },
  totalEarn: {
    type: Number,
    default: 0
  },
  refEarn: {
    type: Number,
    default: 0
  },
  depositAmount: {
    type: Number,
    default: 0
  },
  investedAmount: {
    type: Number,
    default: 0
  },
  // Per-investment lot tracking for 24h eligibility windows
  investedLots: [
    {
      amount: { type: Number },
      status: { type: String, enum: ['Pending', 'Confirmed'] },
      createdAt: { type: Date }
    }
  ],
  otp: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
