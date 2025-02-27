const User = require("../models/user");
const Address = require("../models/address");
const PersonType = require("../models/personType");
const bcrypt = require("bcrypt");
const ClientBookInfo = require("../models/customer/clientBookInfo");
const ChefAvailable = require("../models/chef/chefAvaliable");

const coordinatorSignup = async (req, res) => {
  try {
    const { name, lastName, email, password, phone, gender, dateOfBirth } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const role = "coordinator";
    const NewPersonType = new PersonType({ role });
    await NewPersonType.save();
    // Create a Coordinator User
    const coordinator = new User({
      name,
      lastName,
      email,
      password: hashedPassword,
      phone,
      gender,
      dateOfBirth,
      personTypeId: NewPersonType._id, // Ensure a valid ID matches your schema
    });

    await coordinator.save();
    res.redirect(`/signup/address?userId=${coordinator._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error in Coordinator Signup");
  }
};

const coordinatorAddress = async (req, res) => {
  try {
    const { street, city, state, region, postalCode, country, userId } =
      req.body;

    // Create and link the address
    const address = new Address({
      street,
      city,
      state,
      region,
      postalCode,
      country,
    });

    const savedAddress = await address.save();

    // Link address to the user
    await User.findByIdAndUpdate(userId, { location: savedAddress._id });

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error in Address Submission");
  }
};

const renderAllocateChefPage = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Fetch the specific booking details
    const booking = await ClientBookInfo.findById(bookingId).populate(
      "clientid",
      "name lastName email phone location gender"
    );

    if (!booking) {
      return res.status(404).send("Booking not found.");
    }

    // Fetch all chefs
    const coordinator = await User.findById(req.user._id).populate("location");
    const region = coordinator.location.region;
    const allUsersWithLocation = await User.find({
      location: { $exists: true },
    })
      .populate("personTypeId location")
      .exec();

    const chefs = allUsersWithLocation.filter((user) => {
      return (
        user.personTypeId.role === "chef" && user.location.region === region
      );
    });

    // Fetch all bookings with populated chef and client details
    const chefBookings = await ClientBookInfo.find()
      .populate("chefid", "name email location")
      .populate("clientid", "name email");

    // Extract the IDs of the chefs in the same region
    const chefIdsInRegion = chefs.map((chef) => chef._id.toString());

    // Filter bookings where the chef is in the same region
    const filteredChefBookings = chefBookings.filter((booking) => {
      return (
        booking.chefid &&
        chefIdsInRegion.includes(booking.chefid._id.toString())
      );
    });

    res.render("allocateChef", {
      booking,
      chefs,
      chefBookings: filteredChefBookings,
    });
  } catch (error) {
    console.error("Error fetching booking or chefs:", error);
    res.status(500).send("Internal Server Error");
  }
};


const allocateChef = async (req, res) => {
  try {
    const { bookingId, chefId, startTime, endTime } = req.body;

    // Validate input
    if (!bookingId || !chefId || !startTime || !endTime) {
      return res.status(400).send("All fields are required.");
    }

    // Update the booking with the selected chef ID and time slot
    await ClientBookInfo.findByIdAndUpdate(bookingId, {
      chefid: chefId,
      startTime,
      endTime,
    });

    // Redirect back to the dashboard or a success page
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error allocating chef:", error);
    res.status(500).send("Internal Server Error");
  }
};

const renderEditChefPage = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Fetch the booking
    const booking = await ClientBookInfo.findById(bookingId)
      .populate("clientid", "name email phone location")
      .populate("chefid", "name email");

    if (!booking) {
      return res.status(404).send("Booking not found.");
    }

    // Get the coordinator's region
    const coordinator = await User.findById(req.user._id).populate("location");
    const region = coordinator.location.region;

    // Fetch all chefs

    const allUsersWithLocation = await User.find({
      location: { $exists: true },
    })
      .populate("personTypeId location")
      .exec();
    const chefs = allUsersWithLocation.filter((user) => {
      return (
        user.personTypeId.role === "chef" && user.location.region === region
      );
    });

    // Fetch all bookings with populated chef and client details
    const chefBookings = await ClientBookInfo.find()
      .populate("chefid", "name email location")
      .populate("clientid", "name email");

    // Extract the IDs of the chefs in the same region
    const chefIdsInRegion = chefs.map((chef) => chef._id.toString());

    // Filter bookings where the chef is in the same region
    const filteredChefBookings = chefBookings.filter((booking) => {
      return (
        booking.chefid &&
        chefIdsInRegion.includes(booking.chefid._id.toString())
      );
    });

    res.render("editChef", {
      booking,
      chefs,
      chefBookings: filteredChefBookings,
    });
  } catch (error) {
    console.error("Error rendering edit chef page:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateChef = async (req, res) => {
  try {
    const { bookingId, chefId, startTime, endTime } = req.body;

    // Validate input
    if (!bookingId || !chefId || !startTime || !endTime) {
      return res.status(400).send("All fields are required.");
    }

    // Validate time logic
    if (startTime >= endTime) {
      return res.status(400).send("Start time must be before end time.");
    }

    // Update the booking
    await ClientBookInfo.findByIdAndUpdate(bookingId, {
      chefid: chefId,
      startTime,
      endTime,
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error updating chef:", error);
    res.status(500).send("Internal Server Error");
  }
};

// View Leave Requests of chefs 
const viewLeaveRequests = async (req, res) => {
  try {
    const regionId = req.user.regionId; // Assuming coordinator's region is stored in `req.user`

    console.log(regionId);

    // Fetch leave requests for chefs in the coordinator's region
    const leaveRequests = await ChefAvailable.find({
      chefLocation: regionId, // Match region ID
      "absencePeriods.status": "pending", // Fetch only pending requests
    }).populate("chefId", "name"); // Populate chef's name

    console.log(leaveRequests);

    // Structure the response
    const response = leaveRequests.map((record) => ({
      chefName: record.chefId.name,
      chefId: record.chefId._id, // Include chefId for form submission
      leaveRequests: record.absencePeriods.filter((period) => period.status === "pending"),
    }));

    console.log(response);

    // Render the EJS template and pass the data
    res.render("leaveRequests", { leaveRequests: response });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).send("Internal Server Error");
  }
};


// Update Leave Request Status
const updateLeaveRequestStatus = async (req, res) => {

  try {
    const { chefId, absenceId } = req.params; // Extract chefId and absenceId from the URL
    const { status } = req.body; // Extract status from the request body

    // Validate status
    if (!["approved", "denied"].includes(status)) {
      return res.status(400).send("Invalid status.");
    }

    // Find the chef's availability record and update the leave status
    const chefAvailability = await ChefAvailable.findOneAndUpdate(
      { chefId, "absencePeriods._id": absenceId },
      { $set: { "absencePeriods.$.status": status } },
      { new: true }
    );

    if (!chefAvailability) {
      return res.status(404).send("Leave request not found.");
    }

    res.status(200).send("Leave request status updated successfully.");
  }
  catch (error) {
    console.error("Error updating leave request status:", error);
    res.status(500).send("Internal Server Error");
  }
};




module.exports = {
  coordinatorSignup,
  coordinatorAddress,
  renderAllocateChefPage,
  allocateChef,
  renderEditChefPage,
  updateChef,
  viewLeaveRequests,
  updateLeaveRequestStatus
  // viewLeaveRequests,
  // updateLeaveRequestStatus,
};