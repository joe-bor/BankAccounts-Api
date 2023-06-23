const express = require("express");
const morgan = require("morgan");
const users = require("./routes/users");
const accounts = require("./routes/accounts");
// require transaction routes
const app = express();

//middleware
app.use(express.json());
app.use(morgan("combined"));
// use urlencoded for my form
//TODO: read about helmet
app.use("/users", users);
app.use("/accounts", accounts);
// use the routers of each model

module.exports = app;
