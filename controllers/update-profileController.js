const User = require("../models/user");
const Address = require("../models/address");

const updateProfile = async (req, res) => {
  try {
    const { phone, street, city, state, postalCode, region } = req.body;
    const userId = req.user._id;

    if (!phone || !street || !city || !state || !postalCode) {
      return res.status(400).send("All fields are required");
    }

    const newAddress = await Address.create({
      street,
      city,
      state,
      postalCode,
      region,
    });
    await User.findByIdAndUpdate(
      userId,
      { phone, location: newAddress._id },
      { new: true }
    );

    res.redirect("/dashboard"); // Redirect back to the dashboard after updating
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = updateProfile;
