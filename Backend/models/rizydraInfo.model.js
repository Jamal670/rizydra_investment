const mongoose = require("mongoose");

const rizydraInfoSchema = new mongoose.Schema({
  dailyPercentage: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("RizydraInfo", rizydraInfoSchema);
