const mongoose = require("mongoose");

const coordinatorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Links to the User schema for coordinator details
    },
    assignedCustomers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Links to the User schema for customers
      },
    ],
    verificationTasks: [
      {
        customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"], // Status of the verification
          default: "pending",
        },
        remarks: { type: String }, // Additional notes from the coordinator
        verifiedAt: { type: Date }, // Timestamp for when the verification was completed
      },
    ],
    region: {
      type: String, // Region or area assigned to the coordinator
      required: true,
    },
    availabilityStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // Indicates whether the coordinator is available for assignments
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

const Coordinator = mongoose.model("Coordinator", coordinatorSchema);
module.exports = Coordinator;
