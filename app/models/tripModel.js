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
    required: true,
    validate: {
      validator: function (date) {
        return date <= this.endDate;
      },
      message: "Start Date must be before End Date",
    },
  },
  endDate: {
    type: Date,
    required: true,
  },
  schedule: {
    type: [[String]],
  },
  createdOn: {
    type: Date,
  },
  tripOwner: {
    type: String,
  },
});

tripSchema.pre("save", function (next) {
  this.createdOn = Date.now();
  const duration =
    Math.ceil((this.endDate - this.startDate) / (24 * 60 * 60 * 1000)) + 1;
  if (this.isNew) {
    for (let i = 0; i < duration; i++) {
      this.schedule.push([]);
    }
  }
  next();
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
