const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.ACCESS_TOKEN_SECRET;

exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, secret);
    const user = await User.findOne({ _id: data._id });
    if (!user || !user.isLoggedIn)
      throw new Error({ message: "Invalid Credentials" });
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send({ message: Error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ users });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.user._id });
    res.json({ message: `User ${req.user._id} successfully deleted` });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const user = await User.findById(req.params.id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.json({ user });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ user });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.showUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ user });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (
      !user ||
      !(await bcrypt.compare(`${req.body.password}${secret}`, user.password))
    ) {
      res.status(400).send("Invalid User Credentials");
    } else {
      const token = await user.generateAuthToken();
      user.isLoggedIn = true;
      await user.save();
      res.json({ user, token });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    req.user.isLoggedIn = false;
    await req.user.save();
    res.json({ message: `Successfully Logged Out ${req.user.name}` });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
