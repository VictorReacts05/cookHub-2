const { verifyToken,authorizeRoles } = require("../middlewares/authMiddleware"); // Path to your middleware file
const updateProfile = require("../controllers/update-profileController");
const express = require("express");
const router = express.Router();

router.get("/update-profile",authorizeRoles("coordinator","admin","customer"), verifyToken, (req, res) => {
  res.render("updateProfile"); // Render the profile update form
});
router.post("/update-profile", verifyToken, updateProfile);

module.exports = router;
