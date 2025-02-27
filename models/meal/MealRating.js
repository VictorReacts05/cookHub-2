const mongoose = require("mongoose");

const mealRatingSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 }, // Restricted rating to 1-5
    review: { type: String, required: true },
    clintCookMenuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientCookMealSchedule",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
); // Automatically handle createdAt and updatedAt

const MealRating = mongoose.model("MealRating", mealRatingSchema);
module.exports = MealRating;
