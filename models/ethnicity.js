const mongoose = require("mongoose");

const ethnicitySchema = new mongoose.Schema({
  ethnicityName: { type: String, required: true, unique: true }, // e.g., "Gujarati", "Punjabi"
});

const Ethnicity = mongoose.model("Ethnicity", ethnicitySchema);
module.exports = Ethnicity;
