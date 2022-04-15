const mongoose = require("mongoose");
const slugify = require("slugify");
const activitySchema = require("./activityModel");

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: [100, "A Trip name should not exceed 100 characters"],
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  description: {
    type: String,
    maxLength: [500, "Description should not exceed 500 characters"],
  },
  schedule: {
    type: [[activitySchema]],
  },
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
