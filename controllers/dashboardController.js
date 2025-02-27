const User = require("../models/user");
const ChefAvailable = require("../models/chef/chefAvaliable");
const ClientBookInfo = require("../models/customer/clientBookInfo");

const dashboard = async (req, res) => {
  try {
    // Fetch the user and their role
    const user = await User.findById(req.user._id).populate("personTypeId");

    // Ensure personTypeId exists before accessing its properties
    if (!user || !user.personTypeId) {
      console.error("User or personTypeId is undefined");
      return res
        .status(400)
        .render("error", { message: "User role not found." });
    }

    const role = user.personTypeId.role;

    // Render the appropriate dashboard based on the role
    switch (role) {
      case "admin":
        return res.render("dashboards/adminDashboard", { user, role });

      case "customer":
        try {
          const chefs = await User.find().populate("personTypeId");
          const chefUsers = chefs.filter(
            (chef) => chef.personTypeId && chef.personTypeId.role === "chef"
          );

          // Fetch client booking information where chefid exists
          const clientBookings = await ClientBookInfo.find({
            clientid: req.user._id,
            chefid: { $exists: true }, // Ensure chefid exists
          })
            .populate(
              "chefid",
              "name lastName email gender backgroundCheckVerified"
            )
            .populate("serviceFees", "fee amount");

          return res.render("dashboards/customerDashboard", {
            user,
            role,
            chefUsers,
            clientBookings, // Pass filtered bookings to the view
          });
        } catch (error) {
          console.error("Error fetching chefs and bookings:", error);
          return res
            .status(500)
            .render("error", { message: "Error loading chefs and bookings." });
        }
      case "chef":
        try {
          const chefAvailable = await ChefAvailable.findOne({
            chefId: req.user._id,
          })
            .populate("chefId")
            .populate("chefLocation");

          const bookings = await ClientBookInfo.find({ chefid: req.user._id })
            .populate("clientid", "name email phone") // Include client details
            .populate("serviceFees", "fee amount") // Include service fee details if needed
            .sort({ startDate: 1 }); // Optional: Sort bookings by start date

          return res.render("dashboards/chefDashboard", {
            user,
            role,
            chefAbsence: chefAvailable || { absencePeriods: [] },
            chefAddress: chefAvailable?.chefLocation || null,
            chefDescription:
              chefAvailable?.chefDescription || "No description available",
            chefExperience: chefAvailable?.chefExperience || "Not specified",
            bookings, // Pass bookings to the template
          });
        } catch (error) {
          console.error("Error fetching chef data or bookings:", error);
          return res
            .status(500)
            .render("error", { message: "Error loading chef data." });
        }

      case "coordinator":
        try {
          const coordinator = await User.findById(req.user._id).populate(
            "location"
          );
          const region = coordinator.location.region;
          const allUsersWithLocation = await User.find({
            location: { $exists: true },
          })
            .populate("personTypeId location")
            .exec();
          // .populate("ethnicityId"); // Include Ethnicity details if available

          // Separate users into customers and chefs based on personTypeId
          const customers = allUsersWithLocation.filter((user) => {
            return (
              user.personTypeId.role === "customer" &&
              user.location.region === region
            );
          });

          const chefs = allUsersWithLocation.filter((user) => {
            return (
              user.personTypeId.role === "chef" &&
              user.location.region === region
            );
          });
          const customerIds = customers.map((customer) => customer._id);

          // Use the extracted IDs in the query
          const unassignedBookings = await ClientBookInfo.find({
            chefid: { $exists: false },
            clientid: { $in: customerIds }, // Use an array of IDs
          }).populate({
            path: "clientid",
            populate: {
              path: "location", // Populate the location field
              // select: "region", // Fetch only the region field from location
            },
          });

          // Fetch bookings with assigned chefs
          const assignedBookings = await ClientBookInfo.find({
            chefid: { $exists: true },
            clientid: { $in: customerIds },
          })
            .populate("clientid", "name email phone location") // Populate customer details
            .populate("chefid", "name email phone"); // Populate chef details

          return res.render("dashboards/coordinatorDashboard", {
            user: coordinator,
            customers,
            chefs,
            unassignedBookings,
            assignedBookings,
          });
        } catch (error) {
          console.error("Error fetching users:", error);
          return res.status(500).json({ message: "Error loading user data." });
        }

      default:
        return res.render("dashboards/defaultDashboard", { user, role });
    }
  } catch (error) {
    // Log the error and render an error page
    console.error(error);
    return res
      .status(500)
      .render("error", { message: "Internal Server Error" });
  }
};

module.exports = { dashboard };
