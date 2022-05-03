const express = require("express");
const server = require("../server");

const {
  createActivity,
  deleteActivity,
  updateActivity,
  getActivity,
  getAllActivities,
} = require("../controllers/activityController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").post(protect, createActivity).get(protect, getAllActivities);

router
  .route("/:id")
  .delete(protect, deleteActivity)
  .patch(protect, updateActivity)
  .get(protect, getActivity);

module.exports = router;
