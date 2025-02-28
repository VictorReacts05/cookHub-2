const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClientBookInfo",
    required: true,
  },
  coordinatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  verifiedMembers: {
    type: Number,
    required: true,
  },
  hasKitchenTools: {
    type: Boolean,
    required: true,
  },
  kitchenCleanliness: {
    type: String,
    enum: ["excellent", "good", "fair", "poor"],
    required: true,
  },
  cookingSpace: {
    type: String,
    enum: ["spacious", "adequate", "limited"],
    required: true,
  },
  specialRequirements: {
    type: String,
  },
  accessNotes: {
    type: String,
  },
  additionalNotes: {
    type: String,
  },
  verifiedAt: {
    type: Date,
    default: Date.now,
  },
});

const Verification = mongoose.model("Verification", verificationSchema);
module.exports = Verification;
