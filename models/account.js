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
    accountNumber: {
      type: Number,
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
    },
  },
  {
    timestamps: true,
  }
);

// Generates an account number for the document
accountSchema.pre("save", async function (next) {
  if (this.isNew) {
    let count = await this.constructor.countDocuments();
    this.accountNumber = count;
  }
  next();
});

// TODO: pre 'save' hook => update owner's netWorth ?

// TODO: implement withdraw
// TODO: implement deposit
// TODO: implement transfer ??

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
