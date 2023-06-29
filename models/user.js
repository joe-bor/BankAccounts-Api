const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.ACCESS_TOKEN_SECRET;
const Account = require("../models/account");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 25,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      minLength: 5,
      maxLength: 40,
      trim: true,
      required: true,
      // unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      match: /^(?=.*[!@#$%^&*()-])/, // a special character must be present in the password
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    accounts: [Account.schema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Virtual property - computed when called
// calculates net worth by summing up all of user's accounts' balance
userSchema.virtual("netWorth").get(function () {
  if (this.accounts.length > 0) {
    let sum = this.accounts.reduce((total, elem) => total + elem.balance, 0);
    return sum;
  } else {
    return 0;
  }
});

// hash the password when modified
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(`${this.password}${secret}`, 6);
  }
  next();
});

// Capitalizes the first letter of each word in 'name' field
userSchema.pre("save", async function (next) {
  let names = this.name.toLowerCase().split(" ");
  for (let i = 0; i < names.length; i++) {
    names[i] = names[i][0].toUpperCase() + names[i].slice(1);
  }
  this.name = names.join(" ");
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const accessToken = jwt.sign(
    {
      _id: this._id,
    },
    secret
    // { expiresIn: "1h" }
  );
  return accessToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
