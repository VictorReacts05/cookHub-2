const mongoose = require("mongoose");

const chefcertifictaeSchema = new mongoose.Schema({
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  attachementURL: {
    type: String,
  },
  certifictaeName: {
    type: String,
  },
  certifictaePicture: {
    type: String,
  },
  issueBy: {
    type: String,
  },
});
const Chefcertifictae = mongoose.model(
  "Chefcertifictae",
  chefcertifictaeSchema
);
module.exports = Chefcertifictae;
