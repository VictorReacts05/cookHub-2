const mongoose = require("mongoose");

const personTypeSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["customer", "chef", "admin", "guest", "coordinator"], // Corrected typo "coodinater"
    required: true,
  },
});

const PersonType = mongoose.model("PersonType", personTypeSchema);
module.exports = PersonType;
