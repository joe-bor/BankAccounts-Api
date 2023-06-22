const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    uppercase: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["checking", "saving"],
    default: "checking",
    required: true,
  },
  accountNumber: {
    type: Number,
    // TODO: Re-read .countDocuments in mongoose docs
    // TODO: dynamically generate, can use pre-save hook
    // const count this.countDocuments(); ?
    immutable: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    // TODO: assign to  current user that is logged in
  },
  timestamps: true,
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
