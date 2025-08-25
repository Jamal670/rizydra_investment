// investment.model.js
const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: true,
    },
    exchangeType: {
      type: String,
      required: true,
    },
    ourExchange: {
      type: String,
      required: true,
    },
    amount: {
      type: Number, // use Number instead of String for amounts
      required: true,
      min: 0,
    },
    userExchange: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default: '', // optional
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Declined'],
      default: 'Pending',
    },
    type: {
      type: String,
      enum: ['Deposit', 'Withdraw'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Investment', investmentSchema);
