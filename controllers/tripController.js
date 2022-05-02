const Activity = require("../models/activityModel");
const Trip = require("../models/tripModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

exports.getAllTrips = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.body.requesterId);
  const promises = [];

  for (let tripId of user.trips) {
    promises.push(Trip.findById(tripId));
  }
  const trips = await Promise.all(promises);

  res.status(200).json({
    status: "success",
    data: trips,
  });
});

exports.getTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);

  if (trip.tripOwner !== req.body.requesterId) {
    next(new AppError("Trip does not belong to logged in user"));
    return;
  }
  res.status(200).json({
    status: "success",
    data: trip,
  });
});

exports.createTrip = catchAsync(async (req, res, next) => {
  req.body.tripOwner = req.body.requesterId;
  const newTrip = await Trip.create(req.body);
  const user = await User.findById(req.body.tripOwner);

  user.trips.push(newTrip._id);
  user.save();

  res.status(200).json({
    status: "success",
    data: {
      trip: newTrip,
    },
  });
});

exports.updateTrip = catchAsync(async (req, res, next) => {
  let trip = await Trip.findById(req.params.id);

  if (!trip) {
    next(new AppError("Trip not found"));
    return;
  } else if (trip.tripOwner !== req.body.requesterId) {
    next(new AppError("Trip does not belong to logged in user"));
    return;
  }

  if (req.body.startDate || req.body.endDate) {
    const newStartDate = req.body.startDate || trip.startDate;
    const newEndDate = req.body.endDate || trip.endDate;
    if (newEndDate <= newStartDate) {
      next(new AppError("End Date must be after Start Date"));
      return;
    }
  }

  trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false,
  });

  res.status(200).json({
    status: "Successfully Updated",
    data: {
      trip,
    },
  });
});

exports.deleteTrip = catchAsync(async (req, res, next) => {
  let trip = await Trip.findById(req.params.id);

  if (!trip) {
    next(new AppError("Trip not found"));
    return;
  } else if (trip.tripOwner !== req.body.requesterId) {
    next(new AppError("Trip does not belong to logged in user"));
    return;
  }

  trip = await Trip.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
  });
});

exports.getSchedule = catchAsync(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    next(new AppError("Trip not found"));
    return;
  } else if (trip.tripOwner !== req.body.requesterId) {
    next(new AppError("Trip does not belong to logged in user"));
    return;
  }

  const scheduleById = trip.schedule;
  const promises = [];

  for (let activityId of scheduleById) {
    promises.push(Activity.findById(activityId));
  }

  const activities = await Promise.all(promises);

  res.status(200).json({
    status: "success",
    activities,
  });
});

exports.updateSchedule = catchAsync(async (req, res, next) => {
  let trip = await Trip.findById(req.params.id);

  if (!trip) {
    next(new AppError("Trip not found"));
    return;
  } else if (trip.tripOwner !== req.body.requesterId) {
    next(new AppError("Trip does not belong to logged in user"));
    return;
  }
  const scheduleUpdate = { scheduleById: req.body.scheduleById };
  trip = await Trip.findByIdAndUpdate(req.params.id, scheduleUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "Updated Schedule",
    data: {
      trip,
    },
  });
});

exports.assignTripOwner = catchAsync(async (req, res, next) => {
  const decoded = await promisify(jwt.decode)(token, process.env.JWT_SECRET);
  req.body.tripOwner = decoded.id;
});
