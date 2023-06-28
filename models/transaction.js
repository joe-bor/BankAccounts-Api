const mongoose = require("mongoose");
const Account = require("../models/account");

const transactionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["withdraw", "deposit", "transfer"],
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
    forAccount: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Account",
    },
    transferRecipient: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Account",
      required: function () {
        return this.category === "transfer";
      },
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
