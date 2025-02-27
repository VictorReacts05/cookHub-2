const express = require("express");
const { verifyToken,authorizeRoles } = require("../middlewares/authMiddleware"); // Path to your middleware file
const checkCustomerDetails = require("../middlewares/checkCustomerDetails"); // Path to your middleware file
const {
  chefunAvailable,
  chefDescription,
  chefExperience,
  bookChef,
  // deleteAllAbsencePeriods,
} = require("../controllers/chefController"); // Path to your controller file
const router = express.Router();

// Render chef availability form
router.get("/chefAvailability",authorizeRoles("coordinator","admin"), (req, res) => {
  res.render("chefAvailability");
});

// POST or UPDATE absence periods with `verifyToken`
router.post("/chefAvailability", verifyToken,authorizeRoles("coordinator","admin","chef"), chefunAvailable);

// router.post("/updateAddress", verifyToken, chefAddress);

router.post("/updateDescription", verifyToken,authorizeRoles("chef","admin"), chefDescription);

router.post("/updateExperience", verifyToken,authorizeRoles("chef","admin"), chefExperience);

router.get("/chefHireRequest/", verifyToken,authorizeRoles("chef","admin","customer","coordinator"), (req, res) => {
  res.render("chefHireProcess");
});

router.post("/leave-request", verifyToken,authorizeRoles("chef","admin"), checkCustomerDetails, bookChef);



module.exports = router;
