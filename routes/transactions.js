const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const accounts = require("../controllers/accounts");
const transactions = require("../controllers/transactions");

// Index - display ALL transactions
router.get("/", users.auth, transactions.getTransactions);

// Create - withdraw / deposit to specific account
router.post(
  "/:id/withdraw",
  users.auth,
  accounts.freezeCheck,
  transactions.createTransaction
);

module.exports = router;
