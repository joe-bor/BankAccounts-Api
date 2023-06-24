const mongoose = require("mongoose");

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
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
