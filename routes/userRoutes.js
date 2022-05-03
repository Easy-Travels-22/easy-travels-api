const express = require("express");

const {
  registerUser,
  loginUser,
  updatePassword,
} = require("../controllers/authController");

const {
  getUserTrips,
  getAllUsers,
  getUser,
  updateMe,
  deleteUser,
} = require("../controllers/userController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.post("/sign-up", registerUser);
router.post("/login", loginUser);
router.patch("/updateMyPassword", protect, updatePassword);
router.patch("/updateMe", protect, updateMe);

router.get("/get-user-trips", getUserTrips);

router.route("/").get(protect, restrictTo("Admin"), getAllUsers);
router.route("/:id").get(getUser);

module.exports = router;
