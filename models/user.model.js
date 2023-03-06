const mongoose = require("mongoose");
const { genSalt, hash } = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      unique: true,
      lowercase: true,
    },
    userName: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      default: "manager",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
