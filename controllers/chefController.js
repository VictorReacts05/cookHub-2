const User = require("../models/user");
const ChefAvailable = require("../models/chef/chefAvaliable"); // Path to your schema file
const address = require("../models/address");
const ChefRating = require("../models/chef/chefRate"); // Path to your schema file
const ClientBookInfo = require("../models/customer/clientBookInfo"); // Path to your schema file

const chefunAvailable = async (req, res) => {
  try {
    const { absencePeriods } = req.body;
    const chefId = req.user._id;

    if (
      !absencePeriods ||
      !Array.isArray(absencePeriods) ||
      absencePeriods.length === 0
    ) {
      return res.status(400).json({ message: "Absence periods are required" });
    }

    // Process absence periods to handle one-day leaves
    const processedPeriods = absencePeriods.map((period) => ({
      ...period,
      end: period.end || period.start, // If end is empty, set it to start (one-day leave)
    }));

    const chefAvailability = await ChefAvailable.findOneAndUpdate(
      { chefId },
      { $push: { absencePeriods: { $each: processedPeriods } } }, // Push new periods into the array
      { new: true, upsert: true }
    );

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error updating absence periods:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


const chefDescription = async (req, res) => {
  try {
    const { chefDescription } = req.body;
    const chefId = req.user._id;

    await ChefAvailable.findOneAndUpdate(
      { chefId },
      { chefDescription },
      { new: true, upsert: true }
    );

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error updating description:", error);
    res.status(500).send("Internal server error");
  }
};

const chefExperience = async (req, res) => {
  try {
    const { chefExperience } = req.body;
    const chefId = req.user._id;

    await ChefAvailable.findOneAndUpdate(
      { chefId },
      { chefExperience },
      { new: true, upsert: true }
    );

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error updating experience:", error);
    res.status(500).send("Internal server error");
  }
};

const chefInfo = async (req, res) => {
  try {
    const { chefId } = req.params;
    const clientId = req.user._id; // Logged-in customer's ID
    const user = await User.findById(chefId).populate("personTypeId");
    const role = user.personTypeId.role;

    // Fetch chef details and availability
    const chefInfo = await ChefAvailable.findOne({ chefId })
      .populate("chefId")
      .populate("chefLocation");

    // Fetch all ratings for the chef
    const ratings = await ChefRating.find({ chefId }).populate("custmerId");

    // Calculate average rating
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) /
          ratings.length
        : 0;

    // Check if the current user has an active booking
    const activeBooking = await ClientBookInfo.findOne({
      clientid: clientId,
      monthEndDate: { $gte: new Date() }, // Booking is still active
    });

    const isAvailable = !activeBooking; // If no active booking, chef is available for booking

    res.render("chefInfo", {
      user,
      role,
      chefInfo,
      chefId,
      ratings, // Pass individual ratings
      averageRating: averageRating.toFixed(1), // Pass average rating (rounded to 1 decimal)
      isAvailable, // Pass overall availability status for the customer
      activeBooking, // Pass details of the active booking if any
    });
  } catch (error) {
    console.error("Error fetching chef info:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const submitChefRating = async (req, res) => {
  try {
    const { chefId } = req.params;
    const { rating, reviews } = req.body;
    const custmerId = req.user._id; // Assuming req.user contains the logged-in user's information

    // Validate the rating
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if the user has already rated the chef
    const existingRating = await ChefRating.findOne({ chefId, custmerId });

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
      existingRating.reviews = reviews;
      await existingRating.save();
      res.redirect(`/chefInfo/${chefId}`); // Redirect back to the chef info page
    } else {
      // Create a new rating if none exists
      await ChefRating.create({
        chefId,
        rating,
        reviews,
        custmerId,
      });
      res.redirect(`/chefInfo/${chefId}`); // Redirect back to the chef info page
    }
  } catch (error) {
    console.error("Error submitting or updating chef rating:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const bookChef = async (req, res) => {
  try {
    const clientId = req.user._id; // Assuming `req.user._id` contains the logged-in client's ID.
    const { monthStartDate, monthEndDate, noOfMembers, dishCategory } =
      req.body;

    // Ensure dishCategory is an array
    const memberTypes = dishCategory || []; // Handle case when no checkboxes are selected

    let memberDetails = [];

    // Ensure unique member details and retrieve their ObjectId

    const clientBookInfo = await ClientBookInfo.create({
      clientid: clientId,

      noOfMembers,
      dishCategory: memberTypes, // Store selected dish categories
      monthStartDate,
      monthEndDate,
      memberDetails,
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error booking chef:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

   
    
    // const chefAddress = async (req, res) => {
    //   try {
    //     const { street, city, state, postalCode, region } = req.body;
    //     const chefId = req.user._id;
    
    //     // Create or update the address document
    //     const newAddress = await address.create({
    //       street,
    //       city,
    //       state,
    //       postalCode,
    //       region,
    //     });
    
    //     // Update the chef's availability document with the address reference
    //     await User.findOneAndUpdate(
    //       { _id: chefId },
    //       { chefLocation: newAddress._id },
    //       { new: true, upsert: true }
    //     );
    
    //     res.redirect("/dashboard");
    //   } catch (error) {
    //     console.error("Error updating address:", error);
    //     res.status(500).send("Internal server error");
    //   }
    // };


module.exports = {
  chefunAvailable,
  chefDescription,
  chefExperience,
  chefInfo,
  submitChefRating,
  bookChef,
  // deleteAllAbsencePeriods
  // chefAddress,
  // viewLeaveHistory,
};


