const Account = require("../models/account");

exports.freezeCheck = async (req, res, next) => {
  try {
    const account = await Account.findById(req.body.id);
    if (!account || !account.isFrozen) throw new Error("Account Error");
    req.acc = account;
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

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
    const account = await Account.findById(req.params.id);
    if (!account) {
      throw new Error("Account not Found");
    } else {
      // Subtract account's balance to owner's net worth
      req.user.netWorth -= account.balance;
      // remove found account from owner's account array
      let indexOfToBeDeleted = req.user.accounts.indexOf(req.params.id);
      req.user.accounts.splice(indexOfToBeDeleted, 1);
      await req.user.save();
      account.deleteOne();
      res.json(
        `Successfully deleted ${account.name} with ID: ${account._id}, Owner: ${req.user.name}`
      );
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    // Check for balance changes
    // To update user's net worth
    if (req.body.balance) {
      let accountBalanceDifference = req.body.balance - account.balance;
      req.user.netWorth += accountBalanceDifference;
      await req.user.save();
    }
    // Then apply updates to account
    const updates = Object.keys(req.body);
    updates.forEach((updates) => {
      account[updates] = req.body[updates];
    });
    await account.save();

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
    //update user's net worth
    req.user.netWorth += account.balance;
    await req.user.save();

    res.json({ account });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.showAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    res.json({ account });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
