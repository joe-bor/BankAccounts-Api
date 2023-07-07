const express = require("express");
const morgan = require("morgan");
const users = require("./routes/users");
const accounts = require("./routes/accounts");
const transactions = require("./routes/transactions");
const app = express();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use("/users", users);
app.use("/accounts", accounts);
app.use("/transactions", transactions);

module.exports = app;
