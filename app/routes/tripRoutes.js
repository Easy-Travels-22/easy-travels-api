const express = require("express");
const {
  getAllTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  getSchedule,
  updateSchedule,
  deleteAllTrips,
} = require("../controllers/tripController");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.route("/get-schedule/:id").get(protect, getSchedule);
router
  .route("/delete-all")
  .delete(protect, restrictTo("Admin"), deleteAllTrips);
router.route("/update-schedule/:id").patch(updateSchedule);
router.route("/").get(protect, getAllTrips).post(protect, createTrip);
router
  .route("/:id")
  .patch(protect, updateTrip)
  .delete(protect, deleteTrip)
  .get(protect, getTrip);

module.exports = router;
