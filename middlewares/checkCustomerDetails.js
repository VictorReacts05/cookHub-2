const User = require("../models/user");

const checkCustomerDetails = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming req.user contains the logged-in user's info
    const user = await User.findById(userId).populate("location");

    if (!user.phone || !user.location) {
      return res.redirect("/update-profile"); // Redirect to profile update page
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error checking customer details:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = checkCustomerDetails;
