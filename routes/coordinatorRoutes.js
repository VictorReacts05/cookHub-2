const express = require("express");
const router = express.Router();
const {
  coordinatorSignup,
  coordinatorAddress,
  renderAllocateChefPage,
  allocateChef,
  renderEditChefPage,
  updateChef,
  viewLeaveRequests,
  updateLeaveRequestStatus
} = require("../controllers/coordinatorController");
const { submitVerification } = require("../controllers/coordinatorController");
const { verifyToken,authorizeRoles } = require("../middlewares/authMiddleware");

// Render Coordinator Signup Form
router.get("/coordinatorSignup", (req, res) => {
  res.render("coordinatorSignup");
});

// Handle Coordinator Signup Form Submission
router.post("/coordinatorSignup", coordinatorSignup);

// Render Address Form
router.get("/signup/address", (req, res) => {
  const userId = req.query.userId;
  res.render("addressForm", { userId });
});

// Handle Address Form Submission
router.post("/signup/address", coordinatorAddress);

router.get("/allocate-chef/:bookingId", verifyToken,authorizeRoles("coordinator","admin"), renderAllocateChefPage);
router.post("/allocate-chef", verifyToken, allocateChef);

router.get("/edit-chef/:bookingId", verifyToken,authorizeRoles("coordinator","admin"), renderEditChefPage);
router.post("/edit-chef", verifyToken, updateChef);

router.get("/leave-requests", verifyToken,authorizeRoles("coordinator","admin"),viewLeaveRequests);

router.post("/leave-request/:chefId/:absenceId", verifyToken, updateLeaveRequestStatus);

router.get(
  "/verify-booking/:bookingId",
  verifyToken,
  authorizeRoles("coordinator"),
  (req, res) => {
    res.render("verifyBooking", { bookingId: req.params.bookingId });
  }
);

// Handle form submission
router.post(
  "/verify-booking/:bookingId",
  verifyToken,
  authorizeRoles("coordinator"),
  submitVerification
);

module.exports = router;
