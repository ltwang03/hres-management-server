const mongoose = require("mongoose");
const moment = require("moment-timezone");

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
