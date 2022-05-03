const Activity = require("../models/activityModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Trip = require("../models/tripModel");

const activityExistsAndBelongsToRequester = (activity, req, next) => {
  if (!activity) {
    next(new AppError("Activity not found"));
    return false;
  } else if (activity.activityOwner != req.body.requester._id) {
    next(new AppError("Activity does not belong to logged in user"));
    return false;
  } else {
    return true;
  }
};

// Only for developers
exports.getAllActivities = catchAsync(async (req, res, next) => {
  const activities = await Activity.find()
    .where("age")
    .equals(req.body.requester._id);

  res.status(200).json({
    status: "success",
    data: {
      activities,
    },
  });
});

exports.getActivity = catchAsync(async (req, res, next) => {
  const activity = await Activity.findById(req.params.id);

  activityExistsAndBelongsToRequester(activity, req, next);

  res.status(200).json({
    status: "success",
    data: {
      activity,
    },
  });
});

exports.createActivity = catchAsync(async (req, res, next) => {
  req.body.activityOwner = req.body.requester._id;
  const newActivity = await Activity.create(req.body);

  if (!req.body.tripId) {
    next(
      new AppError("Please specify the trip you wish to add this activity to")
    );
  }

  if (!req.body.day) {
    next(
      new AppError(
        "Please specify the day of the trip you wish to add this activity to"
      )
    );
  }

  const trip = await Trip.findById(req.body.tripId);
  const day = parseInt(req.body.day) - 1;

  if (day >= trip.schedule.length) {
    return next(
      new AppError("Day exceeds trip length. Please update start and end date")
    );
  }

  trip.schedule[day].push(newActivity._id);
  trip.markModified("schedule");
  await trip.save();

  res.status(200).json({
    status: "success",
    data: {
      activity: newActivity,
    },
  });
});

exports.updateActivity = catchAsync(async (req, res, next) => {
  let activity = await Activity.findById(req.params.id);

  activityExistsAndBelongsToRequester(activity, req, next);

  activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(400).json({
    status: "Successfully Updated",
    data: {
      activity,
    },
  });
});

exports.deleteActivity = catchAsync(async (req, res, next) => {
  const activity = await Activity.findById(req.params.id);

  activityExistsAndBelongsToRequester(activity, req, next);

  await Activity.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      activity,
    },
  });
});
