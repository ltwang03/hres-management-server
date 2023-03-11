const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    restaurantID: {
      type: String,
      ref: "Restaurant",
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
