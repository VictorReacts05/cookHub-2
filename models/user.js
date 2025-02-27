const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // First name
    lastName: { type: String, required: true }, // Last name
    dateOfBirth: { type: Date }, // Renamed from "dob" for clarity
    aadhaarCard: { type: String }, // Aadhaar Card field
    panCard: { type: String }, // PAN Card field
    drivingLicenseNo: { type: String }, // Driving License
    backgroundCheckVerified: { type: Boolean, default: false }, // Default to false
    personTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonType",
    },
    ethnicityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ethnicity",
    },
    email: { type: String, required: true, unique: true }, // Email field with unique validation
    password: { type: String, required: true }, // Password field
    phone: {
      type: String,

      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v); // Ensures phone number is 10 digits
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"], // Restricted values
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

const User = mongoose.model("User", userSchema);
module.exports = User;
