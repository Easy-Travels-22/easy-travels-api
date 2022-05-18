const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");

const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user = {
    name: user.name,
    _id: user._id,
    trips: user.trips,
    dateJoined: user.dateJoined,
  };

  res.status(statusCode).json({
    status: "success",
    user,
    token,
  });
};

exports.registerUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    password: req.body.password,
    userType: req.body.userType,
  });

  createSendToken(newUser, 201, res);
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;
  if (!name || !password) {
    res.status(400).json({
      status: "No username or password",
    });
  }

  const user = await User.findOne({ name }).select("+password");
  const same = user ? await bcrypt.compare(password, user.password) : false;
  if (!same) {
    return res.status(401).json({
      status: "Username or Password is incorrect",
    });
  }
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // CHECK TOKEN HAS BEEN SENT
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  // CHECK TOKEN IS VALID
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // CHECK IF USER STILL EXISTS
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError("User no longer exists", 401));
  }

  // CHECK IF USER HAS CHANGED PASSWORD
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password. Please log in again", 401)
    );
  }
  req.body.requester = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array
    if (!roles.includes(req.body.requester.userType)) {
      return next(
        new AppError(
          "Logged in user does not have permission to perform this action",
          403
        )
      );
    }
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  if (!req.body.password) {
    next(new AppError("Please provide current password"));
  } else if (!req.body.newPassword) {
    next(new AppError("Please provide new password"));
  }

  // GET USER FROM THE COLLECTION
  const user = await User.findById(req.body.requester._id).select("+password");

  // VERIFY IF SENT PASSWORD IS CORRECT
  const sentPassword = req.body.password;
  const same = await bcrypt.compare(sentPassword, user.password);

  if (!same) {
    return next(new AppError("Sent current password is incorrect.", 401));
  }

  // UPDATE PASSWORD
  user.password = req.body.newPassword;
  await user.save();

  //RE LOG-IN THE USER BY SENDING NEW TOKEN
  createSendToken(user, 200, res);
});
