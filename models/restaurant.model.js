const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
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
    type: [String],
  },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
