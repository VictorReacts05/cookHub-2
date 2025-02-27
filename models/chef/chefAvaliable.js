const mongoose = require("mongoose");

const chefAvailableSchema = new mongoose.Schema(
  {
    chefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Link to the chef's user profile
    },
    chefDescription: { type: String }, // Description about the chef
    chefLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    }, // Location of the chef
    chefExperience: { type: Number }, // Experience in years
    ChefAvailable: { type: Boolean, default: true }, // Default to available
    absencePeriods: [
      {
        date: { type: Date, required: true }, // Specific day of absence
        start: { type: Date }, // Optional start for multi-day absences
        end: { type: Date }, // Optional end for multi-day absences
        reason: { type: String }, // Optional reason for absence
        status: {
          type: String,
          enum: ["pending", "approved", "denied"],
          default: "pending", // Default status is pending
        } // New field: status of the absence (pending, approved, denied)
      },
    ],
  },
  { timestamps: true } // Automatically records createdAt and updatedAt
);

const ChefAvailable = mongoose.model("ChefAvailable", chefAvailableSchema);
module.exports = ChefAvailable;
