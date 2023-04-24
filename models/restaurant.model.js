const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    user: {
      type: [
        {
          userName: { type: String, unique: true },
          fullName: { type: String },
          phoneNumber: { type: Number },
        },
      ],
    },
    table: {
      type: [],
    },
    food: {
      type: [
        {
          resourceID: { type: String, unique: true },
          name: { type: String },
          category: { type: String },
          describe: { type: String },
          price: { type: String },
        },
      ],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Restaurant", restaurantSchema);
