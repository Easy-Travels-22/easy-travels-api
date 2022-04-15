const mongoose = require("mongoose");
const slugify = require("slugify");

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  activityType: {
    type: String,
    enum: {
      values: ["destination", "transit", "location"],
      message: "activity must be of Destination, Transit or Accommodation Type",
    },
  },
  description: {
    type: String,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
});

module.exports = activitySchema;
