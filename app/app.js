const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");

const app = express();
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP",
});

app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));

// DATA SANITIZATION against NoSQL Query Injection
app.use(mongoSanitize());

// DATA SANITIZATION against XSS
app.use(xss());

app.use(helmet());

app.use("/api", limiter);

app.use(compression());

const tripRouter = require("./routes/tripRoutes");
const activityRouter = require("./routes/activityRoutes");
const userRouter = require("./routes/userRoutes");
const errorController = require("./controllers/errorController");

app.use("/api/v1/trips", tripRouter);
app.use("/api/v1/activities", activityRouter);
app.use("/api/v1/users", userRouter);

app.use(errorController);

module.exports = app;
