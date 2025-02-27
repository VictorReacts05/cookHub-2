const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    region: {
      type: String,
      enum: ["paldi", "bopal", "zundal", "gift-city", "university"],
    },
    postalCode: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{5,6}$/.test(v); // Validates 5-6 digit postal codes
        },
        message: (props) => `${props.value} is not a valid postal code!`,
      },
    },
    country: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    landmark: { type: String },
    addressType: { type: String, enum: ["home", "office", "other"] }, // Restricted values
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
