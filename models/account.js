const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["checking", "savings"],
      default: "checking",
      required: true,
    },
    balance: {
      type: Number,
      default: 100,
      min: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
    transactions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Transactions",
    },
  },
  {
    timestamps: true,
  }
);

// TODO: implement withdraw
// TODO: implement deposit
// TODO: implement transfer ??

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
