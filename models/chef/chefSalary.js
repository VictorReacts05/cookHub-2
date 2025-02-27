const mongoose = require("mongoose");

const cherfSalarySchema = new mongoose.Schema({
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  netSalary: {
    type: Number,
  },

  grossSalary: {
    type: Number,
  },
  tax: {
    type: Number,
  },
  deductions: {
    type: Number,
  },
  date: {
    type: Date,
  },
  month: {
    type: String,
  },
  PaymentMethod: {
    type: String,
  },
  //chef service info
  ServiceAmtount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceFee",
  },
});
const CherfSalary = mongoose.model("CherfSalary", cherfSalarySchema);
module.exports = CherfSalary;
