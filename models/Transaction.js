const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  hash: String,
  from: String,
  to: String,
  value: String,
  timestamp: Number,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
