const express = require("express"); 
const router = express.Router();
const { verifyToken,authorizeRoles } = require("../middlewares/authMiddleware");
const { addMeal,getAllMeals,deleteMeal,getAllCustomers,viewAllChefs } = require("../controllers/admin");
// const { updateChefDetails } = require("../controllers/admin");
const { updateChef } = require("../controllers/admin");

router.get("/admin-dashboard", verifyToken, authorizeRoles("admin"),(req,res) => {
    res.render("dashboards/adminDashboard");
});

router.get("/addMealData", verifyToken,authorizeRoles("admin"), (req,res) =>{
    res.render("admin/addMeal");
});
// Define the route for adding a new meal
router.post("/addMeal", verifyToken,authorizeRoles("admin"), addMeal);

// Route to fetch all meals and render the meal list page
router.get("/mealList", verifyToken,authorizeRoles("admin"), getAllMeals);

// Add a POST route to delete a meal by ID
router.post("/deleteMeal/:id", verifyToken,authorizeRoles("admin"), deleteMeal);

// Route to view all chefs
router.get("/chefs",verifyToken,authorizeRoles("admin"), viewAllChefs);

// Route to update chef details
router.post("/chefs/:id",verifyToken,authorizeRoles("admin"), updateChef);

router.get("/getAllCustomers",verifyToken,authorizeRoles("admin"), getAllCustomers);

module.exports = router;