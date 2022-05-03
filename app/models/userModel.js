const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    select: false,
  },
  passwordChangedAt: Date,
  trips: {
    type: [String],
  },
  userType: {
    type: String,
    enum: ["Admin", "User"],
  },
  dateJoined: {
    type: Date,
  },
});

userSchema.pre("save", function (next) {
  this.name = this.name.toLowerCase();
  if (this.userType !== "Admin") this.userType = "User";
  this.dateJoined = Date.now();
  next();
});

userSchema.pre("save", async function (next) {
  // only runs when password was modified
  if (!this.isModified("password")) return next();

  // the 2nd parameter is cost, how highly encrypted the password will be
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now();
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
  return changedTimestamp > JWTTimestamp;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
