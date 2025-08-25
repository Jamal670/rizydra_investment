const mongoose = require('mongoose');

const redUserEarningSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // User collection ka reference
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true, 
  },
  amount: {
    type: Number,
    required: true,
  },
  refLevel: {
    type: Number,
    default: 0,
  },
  earningRef: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RefUserEarning', redUserEarningSchema);
