require("dotenv").config();
const { default: mongoose } = require("mongoose");
const app = require("./app");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once("open", () => {
  console.log("Connected to Mongo Database !!! ");
});

app.listen(PORT, () => {
  console.log(`Connected to PORT ${PORT}`);
});
