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
      type: [],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Restaurant", restaurantSchema);
