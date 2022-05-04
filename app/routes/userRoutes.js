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
  updateUser,
  deleteMe,
  deleteUser,
} = require("../controllers/userController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.post("/sign-up", registerUser);
router.post("/login", loginUser);
router.patch("/update-my-password", protect, updatePassword);
router.patch("/update-my-details", protect, updateMe);
router.patch("/delete-my-account", protect, deleteMe);

router.get("/get-user-trips", getUserTrips);

router.route("/").get(protect, restrictTo("Admin"), getAllUsers);
router
  .route("/:id")
  .get(getUser)
  .patch(protect, restrictTo("Admin"), updateUser)
  .delete(protect, restrictTo("Admin"), deleteUser);

module.exports = router;
