const express = require("express");
const { dashboard } = require("../controllers/dashboardController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/dashboard", verifyToken, dashboard);

module.exports = router;
