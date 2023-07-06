const Account = require("../models/account");
const Transaction = require("../models/transaction");

// Shows transactions of accounts owned by logged in user
exports.getTransactions = async function (req, res) {
  const page = req.query.page || 1;
  const limit = req.query.limit || 4;
  const skip = (page - 1) * limit;
  let sort = req.query.sort || "amount";
  req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

  let sortBy = {};
  sort[1] ? (sortBy[sort[0]] = sort[1]) : (sortBy[sort[0]] = "asc");

  try {
    // this query returns an array of { _id: <value> }
    const userAccounts = await Account.find({ owner: req.user._id }).select(
      "_id"
    );
    // array container for the account ids
    const idOFAccounts = userAccounts.map((account) => account._id);

    const transactions = await Transaction.find({
      forAccount: { $in: idOFAccounts },
    })
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const totalTransactions = await Transaction.countDocuments({
      forAccount: { $in: idOFAccounts },
    });
    const totalPages = Math.ceil(totalTransactions / limit);

    const paginatedTransactions = {
      totalTransactions,
      page: `Page ${page} of ${totalPages}`,
      transactions,
    };
    res.json({ paginatedTransactions });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// Create
exports.withdraw = async function (req, res) {
  try {
    if (req.body.category)
      throw new Error("Routes determine the transaction category");

    if (req.acc.balance - req.body.amount < 0)
      throw new Error("Insufficient Funds!");

    const transaction = new Transaction({
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
    let deposit;
    // Check if category is being provided
    if (req.body.category)
      throw new Error("Routes determine the transaction category");

    // * Converts the money being deposited to USD, if needed
    if (req.body.currency && req.body.currency !== "USD") {
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.API_KEY,
          "X-RapidAPI-Host": "currency-converter5.p.rapidapi.com",
        },
      };
      const response = await fetch(
        `https://currency-converter5.p.rapidapi.com/currency/convert?format=json&from=${req.body.currency}&to=USD&amount=${req.body.amount}`,
        options
      );
      const result = await response.json();
      deposit = result.rates.USD.rate_for_amount;
    }
    const transaction = new Transaction({
      category: "deposit",
      description: req.body.description,
      amount: deposit || req.body.amount,
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

    if (req.acc.balance - req.body.amount < 0)
      throw new Error("Insufficient Funds!");

    const transaction = new Transaction({
      category: "transfer",
      description: req.body.description,
      amount: req.body.amount,
      forAccount: req.acc,
      transferRecipient: req.params.recipientId,
    });

    // update sending account's properties
    req.acc.transactions.push(transaction._id);
    req.acc.balance -= req.body.amount;
    await req.acc.save();
    await transaction.save();

    // update user doc
    let indexOfSendingAccount = req.user.accounts.findIndex((account) => {
      return account._id.toString() === req.body.id;
    });
    req.user.accounts[indexOfSendingAccount] = req.acc;
    await req.user.save();

    // update receiving account's properties
    const recipient = await Account.findById(req.params.recipientId);

    recipient.balance += req.body.amount;
    await recipient.save();

    // update user doc
    let indexOfReceivingAccount = req.user.accounts.findIndex((account) => {
      return account._id.toString() === req.params.recipientId;
    });
    req.user.accounts[indexOfReceivingAccount] = recipient;
    await req.user.save();

    res.json({ transaction });
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
