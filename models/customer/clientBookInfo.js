const mongoose = require("mongoose");

const clientbookinfoSchema = new mongoose.Schema({
  clientid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chefid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  noOfMembers: {
    type: Number,
    required: true,
  },
  dishCategory: [
    {
      type: String,
      required: true,
    },
  ],
  monthStartDate: {
    type: Date,
    required: true,
  },
  monthEndDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // Use ISO 8601 time format (e.g., "16:00" for 4 PM)
  },
  endTime: {
    type: String, // Use ISO 8601 time format (e.g., "18:00" for 6 PM)
  },
  serviceFees: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceFee",
  },
  serviceFeePaid: {
    type: Boolean,
    default: false,
  },
  unavailableDates: [
    {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        default: function () {
          return this.startDate; // Default to startDate if not provided (single day)
        },
      },}
  ],
});

const ClientBookInfo = mongoose.model("ClientBookInfo", clientbookinfoSchema);
module.exports = ClientBookInfo;
