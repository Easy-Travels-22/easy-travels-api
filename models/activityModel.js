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
  activityOwner: {
    type: String,
  },
  createdOn: {
    type: Date,
  },
});

activitySchema.pre("save", function (next) {
  this.createdOn = Date.now();

  next();
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
