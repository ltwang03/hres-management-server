const expressLoader = require("./express");
const mongodbLoader = require("./mongodb");

module.exports = async (expressApp) => {
  await expressLoader(expressApp);
  await mongodbLoader();
};
