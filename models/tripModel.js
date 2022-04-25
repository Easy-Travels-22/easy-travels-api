const mongoose = require("mongoose");
const slugify = require("slugify");
const activitySchema = require("./activityModel");

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: [100, "A Trip name should not exceed 100 characters"],
  },
  description: {
    type: String,
    maxLength: [500, "Description should not exceed 500 characters"],
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  schedule: {
    type: [[String]],
  },
  createdOn: {
    type: Date,
    required: true,
  },
  tripOwner: {
    type: String,
    required: true,
  },
});

tripSchema.pre("save", function (next) {
  this.createdOn = Date.now();
  next();
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
