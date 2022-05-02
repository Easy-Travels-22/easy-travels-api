const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");

exports.registerUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    password: req.body.password,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    data: {
      token,
    },
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;
  if (!name || !password) {
    res.status(400).json({
      status: "No username or password",
    });
    return;
  }

  const user = await User.findOne({ name }).select("+password");
  const same = user ? await bcrypt.compare(password, user.password) : false;
  if (!same) {
    res.status(401).json({
      status: "Username or Password is incorrect",
    });
    return;
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    data: {
      token,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    next(new AppError("You are not logged in"));
    return;
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  req.body.requesterId = decoded.id;

  next();
});
