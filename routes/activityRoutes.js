const express = require("express");
const server = require("../server");

const {
  createActivity,
  deleteActivity,
  updateActivity,
  getActivity,
  getAllActivities,
} = require("../controllers/activityController");

const router = express.Router();

router.route("/").post(createActivity).get(getAllActivities);

router
  .route("/:id")
  .delete(deleteActivity)
  .patch(updateActivity)
  .get(getActivity);

module.exports = router;
