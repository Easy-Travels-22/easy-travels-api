const Activity = require("../models/activityModel");
const catchAsync = require("../utils/catchAsync");

// Only for developers
exports.getAllActivities = catchAsync(async (req, res, next) => {
  const activities = await Activity.find();

  res.status(200).json({
    status: "success",
    data: {
      activities,
    },
  });
});

exports.getActivity = catchAsync(async (req, res, next) => {
  const activity = await Activity.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      activity,
    },
  });
});

exports.createActivity = catchAsync(async (req, res, next) => {
  const newActivity = await Activity.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      activity: newActivity,
    },
  });
});

exports.updateActivity = catchAsync(async (req, res, next) => {
  const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
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
  const activity = await Activity.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      activity,
    },
  });
});
