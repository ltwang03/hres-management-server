const AuthRoute = require("./auth.route");
const SqliteRoute = require("./sqlite.route");

module.exports = (app) => {
  app.use("/api", SqliteRoute);
  app.use("/auth", AuthRoute);
};
