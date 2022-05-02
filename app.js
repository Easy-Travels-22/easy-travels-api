const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const tripRouter = require("./routes/tripRoutes");
const activityRouter = require("./routes/activityRoutes");
const userRouter = require("./routes/userRoutes");
const errorController = require("./controllers/errorController");

app.use("/api/v1/trips", tripRouter);
app.use("/api/v1/activities", activityRouter);
app.use("/api/v1/users", userRouter);

app.use(errorController);

module.exports = app;
