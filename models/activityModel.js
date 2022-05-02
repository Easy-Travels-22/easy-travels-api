const mongoose = require("mongoose");
const slugify = require("slugify");

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  activityType: {
    type: String,
    enum: {
      values: ["destination", "transit", "accommodation"],
      message: "activity must be of Destination, Transit or Accommodation Type",
    },
    required: true,
  },
  startTime: {
    type: Date,
    validate: {
      validator: function (date) {
        return date <= this.endTime;
      },
      message: "Start Time must be before End Time",
    },
  },
  endTime: {
    type: Date,
    validate: {
      validator: function (date) {
        return date >= this.startTime;
      },
      message: "End Time must be after Start Time",
    },
  },
  startLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  endLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  activityOwner: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    required: true,
  },
});

activitySchema.pre("save", function (next) {
  this.createdOn = Date.now();

  next();
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
