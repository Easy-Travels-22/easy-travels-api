const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
  getAllTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  getSchedule,
  updateSchedule,
  assignTripOwner,
} = require("../controllers/tripController");

const router = express.Router();

router.route("/get-schedule/:id").get(protect, getSchedule);
router.route("/update-schedule/:id").patch(updateSchedule);
router.route("/").get(protect, getAllTrips).post(protect, createTrip);
router
  .route("/:id")
  .patch(protect, updateTrip)
  .delete(protect, deleteTrip)
  .get(protect, getTrip);

module.exports = router;
