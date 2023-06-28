const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const accounts = require("../controllers/accounts");
const transactions = require("../controllers/transactions");

// Index - display ALL transactions of accounts owned by the logged in user
router.get("/", users.auth, transactions.getTransactions);

// Withdraw ( create transaction && update account && update user)
router.post(
  "/withdraw",
  users.auth,
  accounts.freezeCheck,
  transactions.withdraw
);

// Deposit ( create transaction && update account && update user)
router.post("/deposit", users.auth, accounts.freezeCheck, transactions.deposit);

//Transfer ( create transaction && update account && update user)
router.post(
  "/transfer/:recipientId",
  users.auth,
  accounts.freezeCheck,
  transactions.transfer
);

// Show
router.get(
  "/:id",
  users.auth,
  accounts.freezeCheck,
  transactions.showTransaction
);
module.exports = router;
