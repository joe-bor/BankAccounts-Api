const Account = require("../models/account");
const Transaction = require("../models/transaction");

// Shows transactions of accounts owned by logged in user
exports.getTransactions = async function (req, res) {
  try {
    // this query returns an array of { _id: <value> }
    const userAccounts = await Account.find({ owner: req.user._id }).select(
      "_id"
    );
    // array container for the account ids
    const idOFAccounts = userAccounts.map((account) => account._id);

    const transaction = await Transaction.find({
      forAccount: { $in: idOFAccounts },
    });
    res.json({ transaction });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// Create
exports.withdraw = async function (req, res) {
  try {
    if (req.body.category)
      throw new Error("Routes determine the transaction category");
    const transaction = await Transaction({
      category: "withdraw",
      description: req.body.description,
      amount: req.body.amount,
      forAccount: req.acc,
    });

    req.acc.transactions.push(transaction._id);
    req.acc.balance -= req.body.amount;
    await req.acc.save();
    await transaction.save();

    // Updates user document
    let indexOfUpdatedAccount = req.user.accounts.findIndex((account) => {
      return account._id.toString() === req.body.id;
    });
    req.user.accounts[indexOfUpdatedAccount] = req.acc;
    await req.user.save();
    res.json({ transaction });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.deposit = async function (req, res) {
  try {
    if (req.body.category)
      throw new Error("Routes determine the transaction category");
    const transaction = await Transaction({
      category: "deposit",
      description: req.body.description,
      amount: req.body.amount,
      forAccount: req.acc,
    });

    req.acc.transactions.push(transaction._id);
    req.acc.balance += req.body.amount;
    await req.acc.save();
    await transaction.save();

    // Updates user document
    let indexOfUpdatedAccount = req.user.accounts.findIndex((account) => {
      return account._id.toString() === req.body.id;
    });
    req.user.accounts[indexOfUpdatedAccount] = req.acc;
    await req.user.save();
    res.json({ transaction });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.transfer = async function (req, res) {
  try {
    if (req.body.category)
      throw new Error("Routes determine the transaction category");
    const transaction = await Transaction({
      category: "transfer",
      description: req.body.description,
      amount: req.body.amount,
      forAccount: req.acc,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.showTransaction = async function (req, res) {
  try {
    const transaction = await Transaction.findById(req.params.id);

    // This ensures the logged in user owns the account the transaction belongs to
    if (!transaction || req.user._id.toString() !== req.acc.owner.toString())
      throw new Error("You don't have access to other people's transactions");

    res.json({ transaction });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// TODO: User's who owns the account should be the only one that can see their transactions
// the same goes for users -> accounts
