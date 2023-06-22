const express = require("express");
const router = express.Router();
const users = require("../controllers/users");

// Index
router.get("/", users.getUsers);

// Delete
router.delete("/:id", users.auth, users.deleteUser);

// Update
router.put("/:id", users.auth, users.updateUser);

// Create (Sign Up)
router.post("/signup", users.createUser);

// Show
router.get("/:id", users.auth, users.showUser);

// Login
router.post("/login", users.loginUser);

// Logout
router.post("/logout", users.auth, users.logoutUser);

module.exports = router;
