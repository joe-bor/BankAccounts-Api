const express = require("express");
const router = express.Router();
const accounts = require("../controllers/accounts");
const users = require("../controllers/users");

// Index - Show current user's accounts
router.get("/", users.auth, accounts.getAccounts);

// Delete
router.delete("/:id", users.auth, accounts.deleteAccount);

// Update
router.put("/:id", users.auth, accounts.updateAccount);

// Create
router.post("/", users.auth, accounts.createAccount);

// Show
router.get("/:id", users.auth, accounts.showAccount);

module.exports = router;
