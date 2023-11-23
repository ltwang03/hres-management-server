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
          product_id: { type: Number },
          resourceID: { type: String },
          name: { type: String },
          category: { type: String },
          describe: { type: String },
          price: { type: String },
        },
      ],
    },
    customer: {
      type: [
        {
          name: { type: String },
          phone: { type: String },
        },
      ],
    },
  },
  { timestamps: true }
);
restaurantSchema.index({ "user.fullName": 1 });
module.exports = mongoose.model("Restaurant", restaurantSchema);
