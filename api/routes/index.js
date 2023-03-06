const AuthRoute = require("./auth.route");

module.exports = (app) => {
  app.use("/auth", AuthRoute);
};
