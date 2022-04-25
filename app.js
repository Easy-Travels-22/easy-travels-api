const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const tripRouter = require("./routes/tripRoutes");
const activityRouter = require("./routes/activityRoutes");

app.use("/api/v1/trips", tripRouter);
app.use("/api/v1/activities", activityRouter);

module.exports = app;
