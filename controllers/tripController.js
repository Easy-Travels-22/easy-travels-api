const { findById, findByIdAndDelete } = require("../models/tripModel");
const Trip = require("../models/tripModel");

exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find();

    res.status(200).json({
      status: "success",
      data: trips,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
    });
  }
};

exports.createTrip = async (req, res) => {
  try {
    const newTrip = await Trip.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        trip: newTrip,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
    });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(400).json({
      status: "Successfully Updated",
      data: {
        trip,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed to update Trip",
      data: error,
    });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        trip,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed to delete Trip",
      data: error,
    });
  }
};

exports.getSchedule = async (req, res) => {
  try {
    const trip = await Trip.find(req.params);
    const schedule = trip ? trip.schedule : null;
    res.status(200).json({
      status: "success",
      data: schedule,
    });
  } catch (error) {
    res.status(404).json({
      status: "Unable to get schedule",
      data: error,
    });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const scheduleUpdate = { schedule: req.body.schedule };
    const trip = await Trip.findByIdAndUpdate(req.params.id, scheduleUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "Updated Schedule",
      data: {
        trip,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Unable to update schedule",
      data: error,
    });
  }
};
