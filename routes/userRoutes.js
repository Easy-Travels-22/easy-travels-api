const express = require("express");

const { registerUser, loginUser } = require("../controllers/authController");

const {
  getUserTrips,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/sign-up", registerUser);
router.post("/login", loginUser);
router.get("/get-user-trips", getUserTrips);

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
