//meal item combo( number of meal item)
const mongoose = require("mongoose");

const clientCookMealScheduleSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String },
  mealList: [
    { meal_id: { type: mongoose.Schema.Types.ObjectId, ref: "MealSchedule" } },
  ],
  description: {
    type: String,
  },
  picture: {
    type: String,
  },

  rate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MealRating",
    required: true,
  },
});
const ClientCookMealSchedule = mongoose.model(
  "ClientCookMealSchedule",
  clientCookMealScheduleSchema
);
module.exports = ClientCookMealSchedule;
