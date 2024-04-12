const express = require("express");
const router = express.Router();
const userModel = require("../models/User.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup endpoint
router.post("/signup", async (req, res) => {
  try {
    const { fullname, username, email, password, role } = req.body;
    let success = false;

    if (
      [fullname, username, email, password, role].some(
        (field) => field?.trim() === 0
      )
    ) {
      return res.status(400).json({
        success,
        msg: "Please fill all the required fields",
        err: null,
      });
    }

    // Check if user exist in DB
    let userExist = await userModel.findOne({ email }).count();
    if (userExist > 0) {
      return res
        .status(409)
        .json({ success, msg: "User already exist", err: null });
    }

    // Save user in DB
    await userModel.create({ fullname, username, email, password, role });
    success = true;
    res.status(200).json({ success, msg: "User created successfully" });
  } catch (error) {
    return res.status(500).json({
      success,
      msg: "Something went wrong. Please try again",
      err: error.message,
    });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    success = false;

    if ([email, password].some((field) => field?.trim() === 0)) {
      return res.status(400).json({
        success,
        msg: "Please fill all the required fields",
        err: null,
      });
    }

    // Check if user exist in DB
    user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success, msg: "User not found", err: null });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ success, msg: "Invalid password", err: null });
    }

    // delete password from user object
    delete user.password;

    // Create jwt
    let data = {
      id: user.id,
    };
    const authToken = jwt.sign(data, process.env.JWT_SECRET_KEY);

    success = true;
    res
      .status(200)
      .json({ success, msg: "Login successfull", data: user, authToken });
  } catch (error) {
    return res.status(500).json({
      success,
      msg: "Something went wrong. Please try again",
      err: error.message,
    });
  }
});

module.exports = router;
