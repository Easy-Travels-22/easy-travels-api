const express = require("express");
const server = require("../server");

const {
  getAllTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  getSchedule,
  updateSchedule,
} = require("../controllers/tripController");

const router = express.Router();

router.route("/get-schedule/:id").get(getSchedule);
router.route("/update-schedule/:id").patch(updateSchedule);
router.route("/").get(getAllTrips).post(createTrip);
router.route("/:id").patch(updateTrip).delete(deleteTrip);

module.exports = router;
