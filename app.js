const express = require("express");
const morgan = require("morgan");
// require user routes
// require account routes
// require transaction routes
const app = express();

//middleware
app.use(express.json());
app.use(morgan("combined"));
// use urlencoded for my form
//TODO: read about helmet
// use the routers of each model
// use the routers of each model
// use the routers of each model

module.exports = app;
