const express = require("express");
const router = express.Router();
const accounts = require("../controllers/accounts");
const users = require("../controllers/users");

// Index - Show current user's accounts
router.get("/", users.auth, accounts.getAccounts);

// Delete

// Update

// Create
router.post("/", users.auth, accounts.createAccount);

// Show

module.exports = router;
