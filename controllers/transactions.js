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

// Create
exports.createTransaction = async function (req, res) {
  try {
    const transaction = await Transaction({
      category: req.body.category,
      description: req.body.description,
      amount: req.body.amount,
      forAccount: req.acc,
    });
    console.log(transaction);
    console.log(req.acc);

    req.acc.transactions.push(transaction._id);
    await req.acc.save();
    await transaction.save();

    /*
    use proper verbs. deposit / withdraw
    show updated balance && updated transactions[] in the response?
    update the balance of acc
    */

    res.json({ transaction });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
