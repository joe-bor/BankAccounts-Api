const Account = require("../models/account");

exports.freezeCheck = async (req, res, next) => {
  try {
    const account = await Account.findById(req.body.id);
    if (!account || account.isFrozen) throw new Error("Account Error");
    req.acc = account;
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    // construct query params
    const page = req.query.page || 1;
    const limit = req.query.limit || 4;
    const skip = (page - 1) * limit;
    let sort = req.query.sort || "balance";
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    // Query DB
    const accounts = await Account.find({ owner: req.user._id })
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const totalResults = await Account.countDocuments({ owner: req.user._id });
    const totalPages = Math.ceil(totalResults / limit);

    // Create detailed response
    const paginatedAccounts = {
      totalResults,
      page: `Page ${page} of ${totalPages}`,
      accounts: accounts,
    };

    res.json({ paginatedAccounts });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account || account.owner.toString() !== req.user._id.toString()) {
      throw new Error("User-Account Error");
    } else {
      // remove found account from owner's account array
      let indexOfToBeDeleted = req.user.accounts.findIndex((account) => {
        return account._id.toString() === req.params.id;
      });
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
    // Checks if user is the owner of account
    if (
      !req.user.accounts.some(
        (account) => account._id.toString() === req.params.id
      )
    )
      throw new Error("You do not own this account");
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    await account.save();

    // Makes sure changes are 'relayed' to user' accounts
    let indexOfToBeUpdated = req.user.accounts.findIndex((account) => {
      return account._id.toString() === req.params.id;
    });
    req.user.accounts[indexOfToBeUpdated] = account;
    await req.user.save();

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

    //add new account into user's account[]
    req.user.accounts.push(account);
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
