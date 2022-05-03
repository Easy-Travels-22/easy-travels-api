const Activity = require("../models/activityModel");
const Trip = require("../models/tripModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

const tripExisstsAndBelongsToRequester = (trip, req, next) => {
  if (!trip) {
    next(new AppError("Trip not found"));
    return false;
  } else if (trip.tripOwner != req.body.requester._id) {
    next(new AppError("Trip does not belong to logged in user"));
    return false;
  } else {
    return true;
  }
};

exports.tripExisstsAndBelongsToRequester = tripExisstsAndBelongsToRequester;

exports.getAllTrips = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.body.requester._id);
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

  if (tripExisstsAndBelongsToRequester(trip, req, next)) {
    res.status(200).json({
      status: "success",
      data: trip,
    });
  }
});

exports.createTrip = catchAsync(async (req, res, next) => {
  req.body.tripOwner = req.body.requester._id;
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
  let trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false,
  });

  if (!tripExisstsAndBelongsToRequester(trip, req, next)) return;

  if (req.body.startDate || req.body.endDate) {
    const newStartDate = new Date(req.body.startDate || trip.startDate);
    const newEndDate = new Date(req.body.endDate || trip.endDate);
    const newDuration = newEndDate.getDate() - newStartDate.getDate() + 1;
    const oldDuration = trip.schedule.length;
    if (newEndDate <= newStartDate) {
      return next(new AppError("End Date must be after Start Date"));
    }
    if (newDuration < oldDuration) {
      trip.schedule = trip.schedule.slice(0, newDuration);
    } else {
      for (let i = 0; i < newDuration - oldDuration; i++) {
        trip.schedule.push([]);
      }
    }
    trip.save();
  }

  res.status(200).json({
    status: "Successfully Updated",
    data: {
      trip,
    },
  });
});

exports.deleteTrip = catchAsync(async (req, res, next) => {
  let trip = await Trip.findById(req.params.id);

  if (tripExisstsAndBelongsToRequester(trip, req, next)) {
    let user = await User.findById(req.body.requester._id);
    user.trips.remove(req.params.id);
    user.save();

    await Trip.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
    });
  }
});

exports.getSchedule = catchAsync(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);

  if (tripExisstsAndBelongsToRequester(trip, req, next)) {
    const promises = [];

    for (let day of trip.schedule) {
      let dayArr = [];
      for (let activity of day) {
        dayArr.push(Activity.findById(activity));
      }
      promises.push(dayArr);
    }

    activities = [];
    for (let promiseArr of promises) {
      let curr = await Promise.all(promiseArr);
      activities.push(curr);
    }

    res.status(200).json({
      status: "success",
      activities,
    });
  }
});

exports.updateSchedule = catchAsync(async (req, res, next) => {
  let trip = await Trip.findById(req.params.id);

  if (tripExisstsAndBelongsToRequester(trip, req, next)) {
    const scheduleUpdate = { schedule: req.body.schedule };
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
  }
});

exports.deleteAllTrips = catchAsync(async (req, res, next) => {
  let users = await User.find();

  for (let user of users) {
    user.trips = [];
    user.save();
  }

  res.status(200).json({
    status: "all trips deleted",
  });
});
