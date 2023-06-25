const mongoose = require("mongoose");
const Account = require("../models/account");

const transactionSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["withdraw", "deposit"],
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  amount: {
    type: Number,
    min: 0,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  forAccount: Account.schema,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
