const express = require("express");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");
// const { verifyToken, } = require("../middlewares/authMiddleware"); // Path to your middleware file
const checkCustomerDetails = require("../middlewares/checkCustomerDetails"); // Path to your middleware file
const {
  chefunAvailable,
  chefInfo,
  chefDescription,
  chefExperience,
  bookChef,
  submitChefRating,
  modifyChefAppointment
} = require("../controllers/chefController"); // Path to your controller file
const router = express.Router();

router.get("/chefInfo/:chefId", verifyToken,authorizeRoles("customer","admin") ,checkCustomerDetails, chefInfo);
router.post("/rateChef/:chefId", verifyToken, submitChefRating);


// Render chef availability form
router.get("/chefAvailability", verifyToken,authorizeRoles("customer","admin"),(req, res) => {
  res.render("chefAvailability");
});

// POST or UPDATE absence periods with `verifyToken`
router.post("/chefAvailability", verifyToken,authorizeRoles("customer","admin"), chefunAvailable);

// router.post("/updateAddress", verifyToken, chefAddress);

router.post("/updateDescription", verifyToken,authorizeRoles("customer","admin"), chefDescription);

router.post("/updateExperience", verifyToken,authorizeRoles("customer","admin"), chefExperience);

router.get("/chefHireRequest/", verifyToken,authorizeRoles("customer","admin"), (req, res) => {
  res.render("chefHireProcess");
});

router.post("/chefHireRequest", verifyToken, checkCustomerDetails, bookChef);

router.get(
  "/modify-appointment/:bookingId",
  verifyToken,
  authorizeRoles("customer"),
  (req, res) => {
    res.render("modifyAppointment", { bookingId: req.params.bookingId });
  }
);
router.post(
  "/modify-appointment/:bookingId",
  verifyToken,
  authorizeRoles("customer"),
  modifyChefAppointment
);


module.exports = router;
