const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { format } = require("morgan");

const UserSchema = new mongoose.Schema(
  {
    restaurantID: {
      type: String,
      ref: "Restaurant",
      lowercase: true,
      trim: true,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    role: {
      type: String,
      enum: ["manager", "staff"],
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      minLength: 10,
      maxLength: 11,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
