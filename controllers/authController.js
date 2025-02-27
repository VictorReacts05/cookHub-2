const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const PersonType = require("../models/personType");
const signup = async (req, res) => {
  try {
    const { name, lastName, email, password, gender } = req.body;
    const role = "customer";
    const hashedPassword = await bcrypt.hash(password, 12);
    const NewPersonType = new PersonType({ role });
    await NewPersonType.save();
    const newUser = new User({
      name,
      lastName,
      email,
      password: hashedPassword,
      gender,
      personTypeId: NewPersonType._id,
    });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).render("signup", { error: "Signup failed." });
  }
};
const ChefSignin = async (req, res) => {
  try {
    console.log(req.body); // Log the incoming request body
    const {
      name,
      lastName,
      dateOfBirth,
      aadhaarCard,
      panCard,
      drivingLicenseNo,
      email,
      password,
      phone,
      gender,
      backgroundCheckVerified,
    } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email is already registered.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const NewPersonType = new PersonType({ role: "chef" });
    await NewPersonType.save();
    // Create a new user instance
    const newUser = new User({
      name,
      lastName,
      dateOfBirth,
      aadhaarCard,
      panCard,
      drivingLicenseNo,
      email,
      password: hashedPassword,
      phone,
      gender,
      personTypeId: NewPersonType._id,
      backgroundCheckVerified: backgroundCheckVerified === "true",
    });

    // Save the user to the database
    await newUser.save();
    res.redirect(`/signup/address?userId=${newUser._id}`);
    // res.redirect("/login");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal server error.");
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("personTypeId", "role");

    if (!user) return res.redirect("/login?error=Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.redirect("/login?error=Invalid credentials");

    // Include role in JWT
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, role: user.personTypeId.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("jwtToken", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).redirect("/login?error=Login failed");
  }
};

const logout = (req, res) => {
  res.clearCookie("jwtToken");
  res.redirect("/login");
};

module.exports = { signup, ChefSignin, login, logout };
