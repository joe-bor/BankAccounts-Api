const Account = require("../models/account");

// exports.createAccount = async (req, res) => {};

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({});
    res.json({ accounts });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete({ _id: req.params.id });
    res.json(
      `Successfully deleted ${account.name} with ID: ${account._id}, Owner: ${req.user.name}`
    );
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body);
    res.json({ account });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const account = new Account({
      name: req.body.name,
      category: req.body.category,
      balance: req.body.balance,
      owner: req.user._id,
    });
    await account.save();

    //push new account into user's account[]
    req.user.accounts.push(account._id);
    await req.user.save();

    res.json({ account });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.showAccount = async (req, res) => {
  try {
    const account = await Account.findById({ _id: req.params.id });
    res.json({ account });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
