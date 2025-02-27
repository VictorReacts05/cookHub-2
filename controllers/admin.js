const User = require("../models/user");
const ChefAvailable = require("../models/chef/chefAvaliable"); // Path to your schema file
const address = require("../models/address");
const ChefRating = require("../models/chef/chefRate"); // Path to your schema file
const ClientBookInfo = require("../models/customer/clientBookInfo"); // Path to your schema file
const MealSchedule = require("../models/meal/MealSchedule");
const PersonType = require("../models/personType");

// Controller function to add a new meal
const addMeal = async (req, res) => {
    try {
      // Log the incoming body to check its structure
      console.log(req.body);  // Add this line
  
      const { name, category, pic, description } = req.body;
  
      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }
  
      // Split category by comma and trim any extra spaces
      const categoryArray = category.split(',').map(cat => cat.trim());
  
      const newMeal = new MealSchedule({
        name,
        category: categoryArray,
        pic,
        description
      });
  
      await newMeal.save();
  
      res.status(201).json({
        message: 'Meal added successfully',
        newMeal
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding meal' });
    }
  };
  
// Controller function to fetch all meals
const getAllMeals = async (req, res) => {
  try {
    const meals = await MealSchedule.find(); // Fetch all meals from the database
    res.render("admin/mealList", { meals }); // Render mealList.ejs with meal data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching meals" });
  }
};

// Controller to delete a meal by ID
const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMeal = await MealSchedule.findByIdAndDelete(id);

    if (!deletedMeal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.redirect("/mealList"); // Redirect back to the meal list page
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const getAllCustomers = async (req, res) => {
  try {
    const { region } = req.query;

    console.log("Filtering by region:", region || "All Regions");

    // Find all customers with role "customer"
    const allcustomers = await PersonType.find({ role: "customer" });

    let customerFilter = { personTypeId: { $in: allcustomers.map(c => c._id) } };

    // If region is provided, fetch locations that match the region
    if (region) {
      const matchingLocations = await address.find({ region }).select("_id").lean();
      const locationIds = matchingLocations.map(loc => loc._id);
      
      console.log("Matching Location IDs:", locationIds);

      customerFilter["location"] = { $in: locationIds };
    }

    // Fetch customers with location and role details
    const customers = await User.find(customerFilter)
      .populate("personTypeId", "role")
      .populate("location", "addressType city state postalCode region")
      .select("name lastName email phone gender location")
      .lean();

    console.log("Total Customers Fetched:", customers.length);

    // Fetch booking details for customers
    const customerIds = customers.map(c => c._id);
    const bookings = await ClientBookInfo.find({ clientid: { $in: customerIds } })
      .select("clientid monthStartDate monthEndDate")
      .lean();

    console.log("Total Bookings Fetched:", bookings.length);

    // Map booking details to customers
    customers.forEach(customer => {
      const booking = bookings.find(b => String(b.clientid) === String(customer._id));
      customer.bookingPeriod = booking
        ? { start: booking.monthStartDate, end: booking.monthEndDate }
        : null;
    });

    console.log("Final Customers with Booking Data:", customers);

    // Render the admin page with customers and selected region
    res.render("admin/getAllCustomers", { customers, selectedRegion: region || "" });

  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Error fetching customers", error: error.toString() });
  }
};

const mongoose = require("mongoose"); // Import mongoose
const updateChef = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid chef ID" });
    }

    // Handle nested updates for location.region
    if (updateData.region) {
      updateData["location.region"] = updateData.region;
      delete updateData.region;
    }

    const updatedChef = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("personTypeId", "role")
      .select("name lastName email phone gender location backgroundCheckVerified");

    if (!updatedChef) {
      return res.status(404).json({ message: "Chef not found" });
    }

    res.status(200).json({ message: "Chef updated successfully", chef: updatedChef });
  } catch (error) {
    console.error("Error updating chef:", error);
    res.status(500).json({ message: "Error updating chef", error: error.toString() });
  }
};


const viewAllChefs = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { name, email, gender, region, backgroundCheckVerified } = req.query;

    console.log("🔍 Filtering Chefs | Name:", name, "| Email:", email, "| Gender:", gender, "| Region:", region, "| Background Check:", backgroundCheckVerified);

    // Fetch all chefs from PersonType schema
    const allChefs = await PersonType.find({ role: "chef" });

    if (!allChefs.length) {
      console.log("⚠️ No chefs found in PersonType.");
      return res.render("admin/chefs", { chefs: [] });
    }

    // Build the filter object dynamically
    const filter = { personTypeId: { $in: allChefs.map(c => c._id) } };

    // Add filters based on query parameters
    if (name) {
      filter.name = { $regex: name, $options: "i" }; // Case-insensitive search for name
    }
    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }
    if (gender) {
      filter.gender = gender; // Exact match for gender
    }
    if (backgroundCheckVerified) {
      filter.backgroundCheckVerified = backgroundCheckVerified === "true";
    }

    console.log("🛠 Applying filters:", filter);

    // Fetch chefs and populate related fields
    let chefs = await User.find(filter)
      .populate("personTypeId", "role")
      .populate({
        path: "location",
        select: "street state region postalCode addressType",
      })
      .select("name lastName email phone gender")
      .lean();

    console.log(`✅ Chefs Found: ${chefs.length}`);

    // Apply region filtering manually (since populate match does not always work)
    if (region) {
      chefs = chefs.filter(chef => chef.location && chef.location.region.toLowerCase() === region.toLowerCase());
    }

    console.log(`📍 Chefs After Region Filtering: ${chefs.length}`);

    // Fetch booking periods for chefs
    const chefIds = chefs.map(c => c._id);
    const bookings = await ClientBookInfo.find({ chefid: { $in: chefIds } })
      .select("chefid monthStartDate monthEndDate")
      .lean();

    console.log(`📅 Booking Records Fetched: ${bookings.length}`);

    // Map booking periods to chefs
    chefs.forEach(chef => {
      const booking = bookings.find(b => String(b.chefid) === String(chef._id));
      chef.bookingPeriod = booking
        ? { start: booking.monthStartDate, end: booking.monthEndDate }
        : null;
    });

    console.log("🔄 Final Chefs List with Booking Data:", chefs);

    res.render("admin/chefs", {
      chefs,
      selectedRegion: region || "",
      name: name || "",
      email: email || "",
      gender: gender || "",
      backgroundCheckVerified: backgroundCheckVerified || "",
    });
    

  } catch (error) {
    console.error("❌ Error fetching chefs:", error);
    res.status(500).json({ message: "Error fetching chefs", error: error.toString() });
  }
};





module.exports = {
  addMeal,
  getAllMeals,
  deleteMeal,
  getAllCustomers,
  viewAllChefs,
  updateChef
  // updateChefDetails,

};

