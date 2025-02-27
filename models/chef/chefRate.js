const mongoose = require("mongoose");

const chefRatingSchema = new mongoose.Schema(
  {
    chefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to the chef
    rating: { type: Number, required: true, min: 1, max: 5 }, // 1-5 rating scale
    reviews: { type: String, required: true }, // User's review of the chef
    custmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

const ChefRating = mongoose.model("ChefRating", chefRatingSchema);
module.exports = ChefRating;

// const mongoosh = require("mongoose");

// const chefRateSchema = new mongoose.Schema({
//   chefId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   rating: {
//     type: Number,
//     required: true,
//   },
//   review: {
//     type: String,
//   },
//   custmerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
// });
// const ChefRate = mongoose.model("ChefRate", chefRateSchema);
// module.exports = ChefRate;
