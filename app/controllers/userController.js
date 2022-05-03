const User = require("../models/userModel");
const Trip = require("../models/tripModel");
const catchAsync = require("../utils/catchAsync");

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
  // authenticate to be either self, else
  // need admin authentication

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

exports.deleteMe = catchAsync(async (req, res, next) => {
  // authenticate to be either self, else
  // need admin authentication

  const user = await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "success",
    data: {
      user,
    },
  });
});
