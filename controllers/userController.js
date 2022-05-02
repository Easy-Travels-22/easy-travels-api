const User = require("../models/userModel");
const Trip = require("../models/tripModel");

exports.getUserTrips = async (req, res) => {
  try {
    const { trips: tripsId } = await User.find().trips;

    const trips = Trip.find(tripsId);

    res.status(200).json({
      status: "success",
      data: {
        trips,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "success",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  // need to admin authentication
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "success",
    });
  }
};

exports.getUser = async (req, res) => {
  // authenticate to be either self, else
  // need admin authentication

  const user = await User.findById(req.params.id);

  res.status(200).json({
    message: "success",
    data: {
      user,
    },
  });
};

exports.updateUser = async (req, res) => {
  // authenticate to be either self, else
  // need admin authentication

  const user = await User.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    message: "success",
    data: {
      user,
    },
  });
};

exports.deleteUser = async (req, res) => {
  // authenticate to be either self, else
  // need admin authentication

  const user = await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "success",
    data: {
      user,
    },
  });
};
