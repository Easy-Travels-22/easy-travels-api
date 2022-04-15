const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const tripRouter = require("./routes/tripRoutes");

app.use("/api/v1/trips", tripRouter);

module.exports = app;
