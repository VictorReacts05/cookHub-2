const mongoose = require("mongoose");

const serviceFeeSchema = new mongoose.Schema(
  {
    chefService: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    serviceFee: { type: Number, required: true },
    serviceStartDate: { type: Date },
    serviceEndDate: { type: Date },
    servicePeriod: { type: String }, // in hours:min:day:date
    lastUpdated: { type: Date, default: Date.now }, // Corrected spelling and added default
    created: { type: Date, default: Date.now },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ServiceFee = mongoose.model("ServiceFee", serviceFeeSchema);
module.exports = ServiceFee;
