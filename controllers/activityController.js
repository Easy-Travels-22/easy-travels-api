const Activity = require("../models/activityModel");

// Only for developers
exports.getAllActivities = async (req, res) => {
  const activities = await Activity.find();

  res.status(200).json({
    status: "success",
    data: {
      activities,
    },
  });
};

exports.getActivity = async (req, res) => {
  const activity = await Activity.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      activity,
    },
  });
};

exports.createActivity = async (req, res) => {
  try {
    const newActivity = await Activity.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        activity: newActivity,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed to Create Activity",
    });
  }
};

exports.updateActivity = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: "Failed to update Trip",
      data: error,
    });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        activity,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed to delete Trip",
      data: error,
    });
  }
};
