//meal item single
const mongoose = require("mongoose");

const MealScheduleSchema = new mongoose.Schema({
  name: { type: String },
  category: [{ type: String }],
  pic: { type: String },
  description: { type: String },
});
const MealSchedule = mongoose.model("MealSchedule", MealScheduleSchema);
module.exports = MealSchedule;
