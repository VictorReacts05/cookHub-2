require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// Routes
const authRoutes = require("./routes/authRoutes");
const indexRoutes = require("./routes/indexRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const chefRoutes = require("./routes/chefRoutes");
const chefHireRoutes = require("./routes/chefHireRoutes");
const customerProfileEditRoute = require("./routes/customerProfileEditRoute");
const coordinatorRoutes = require("./routes/coordinatorRoutes");
const adminRoutes = require("./routes/adminRoute");

const app = express();
const port = process.env.PORT || 8080;
const MongoURL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/cookhub";

// Database Connection
mongoose
  .connect(MongoURL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Error connecting to DB: ", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Authentication Middleware
app.use((req, res, next) => {
  const token = req.cookies.jwtToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.isAuthenticated = true;
      res.locals.user = decoded; // Set user data to locals
    } catch (err) {
      console.error("Invalid token:", err);
      res.locals.isAuthenticated = false;
    }
  } else {
    res.locals.isAuthenticated = false;
    res.locals.user = null;
  }
  next();
});
// Routes
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", chefRoutes);
app.use("/", chefHireRoutes); 
app.use("/", customerProfileEditRoute);
app.use("/", coordinatorRoutes);
app.use("/", adminRoutes);

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
