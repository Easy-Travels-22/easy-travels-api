const express = require("express");
const server = require("../server");

const {
  getAllTrips,
  createTrip,
  updateTrip,
} = require("../controllers/tripController");

const router = express.Router();

router.route("/").get(getAllTrips).post(createTrip);
router.route("/:id").patch(updateTrip);

module.exports = router;
