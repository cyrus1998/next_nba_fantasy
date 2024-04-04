const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lotteryOrderSchema = new Schema({
  order: {
    type: [String],
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  }
});

module.exports = mongoose.models.LotteryOrder || mongoose.model('LotteryOrder', lotteryOrderSchema);
