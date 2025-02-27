const express = require("express");
const {
  signup,
  ChefSignin,
  login,
  logout,
} = require("../controllers/authController");
const { destroyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/signup", (req, res) => {
  if (res.locals.isAuthenticated) return res.redirect("/dashboard"); // Redirect logged-in users
  res.render("signup");
});
router.post("/signup", signup);

router.get("/chefsignin", (req, res) => {
  if (res.locals.isAuthenticated) return res.redirect("/dashboard");
  res.render("ChefSignin");
});

router.post("/chefsignin", ChefSignin);

router.get("/login", (req, res) => {
  if (res.locals.isAuthenticated) return res.redirect("/dashboard"); // Redirect logged-in users
  res.render("login", { error: req.query.error });
});
router.post("/login", login);

router.get("/logout", destroyToken, logout);

module.exports = router;
