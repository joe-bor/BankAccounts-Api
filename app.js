const express = require("express");
const morgan = require("morgan");
const users = require("./routes/users");
// require account routes
// require transaction routes
const app = express();

//middleware
app.use(express.json());
app.use(morgan("combined"));
// use urlencoded for my form
//TODO: read about helmet
app.use("/users", users);
// use the routers of each model
// use the routers of each model

module.exports = app;
