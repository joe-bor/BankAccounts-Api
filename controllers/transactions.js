const Transaction = require("../models/transaction");

// Index
exports.getTransactions = async function (req, res) {
  try {
    const transactions = await Transaction.find({});
    res.json({ transactions });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
