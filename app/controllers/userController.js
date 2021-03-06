const User = require("../models/userModel");
const Trip = require("../models/tripModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");

exports.getUserTrips = catchAsync(async (req, res, next) => {
  const { trips: tripsId } = await User.find().trips;

  const trips = Trip.find(tripsId);

  res.status(200).json({
    status: "success",
    data: {
      trips,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // need to admin authentication
  const users = await User.find();

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    message: "success",
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new AppError("Please update password via updateMyPassword", 400)
    );
  } else if (req.body.userType) {
    return next(new AppError("Please do not change userType"), 400);
  }

  const user = await User.findByIdAndUpdate(
    req.body.requester._id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  res.status(200).json({
    message: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.body.requester._id, req.body, {
    new: true,
  });

  res.status(200).json({
    message: "success",
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.body.requester._id);

  if (!req.body.password) {
    return next(AppError("Please provide your password"));
  } else if (!bcrypt.compare(req.body.password, user.password)) {
    return next(AppError("Password provided is incorrect"));
  }

  user = await User.findByIdAndDelete(req.body.requester._id);

  res.status(200).json({
    message: "success",
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "success",
    data: {
      user,
    },
  });
});
