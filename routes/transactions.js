const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const accounts = require("../controllers/accounts");
const transactions = require("../controllers/transactions");

// Show transactions
router.get("/", users.auth, transactions.getTransactions);

module.exports = router;
