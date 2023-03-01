const mongoose = require("mongoose");
const { CONNECT_DATABASE_KEY } = require("../config");
const asyncHandler = require("express-async-handler");

module.exports = asyncHandler(async () => {
  try {
    await mongoose.connect(CONNECT_DATABASE_KEY);
    console.log("database connected");
  } catch (error) {
    console.error("connect database is fail");
  }
});
