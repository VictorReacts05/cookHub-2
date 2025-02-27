const mongoose = require("mongoose");

const clientCookScheduleSchema = new mongoose.Schema({
  clientid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clientCookinfoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clientbookinfo",
    required: true,
  },
  scheduleStartTime: {
    type: Date,
    required: true,
  },
  scheduleEndTime: {
    type: Date,
    required: true,
  },
  canelled: {
    type: Boolean,
    default: false,
  },
  cancellationReason: {
    type: String,
  },
});
const clientCookSchedule = mongoose.model(
  "clientCookSchedule",
  clientCookScheduleSchema
);
module.exports = clientCookSchedule;
