const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Each user must have a username"],
    unique: [true, "Username has already been taken"],
  },
  password: {
    type: String,
    required: [true, "Each user must have a password"],
    minlength: [5, "User Password must be 5 characters long"],
    maxLength: [20, "User Password cannot exceed 20 characters"],
  },
  trips: {
    type: [String],
  },
  userType: {
    type: String,
    enum: ["Admin", "User"],
  },
  dateJoined: {
    type: Date,
    required: true,
  },
});

userSchema.pre("save", function (next) {
  this.name = this.name.toLowerCase();
  if (this.userType !== "Admin") this.userType = "User";
  this.dateJoined = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
