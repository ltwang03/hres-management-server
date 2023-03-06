const express = require("express");
const asyncHandler = require("express-async-handler");
const { PORT } = require("./config");
const loaders = require("./loaders");

const app = express();
loaders(app);
app.listen(
  PORT,
  asyncHandler(() => {
    console.log(`server is running on port ${PORT}`);
  })
);
