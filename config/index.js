require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  CONNECT_DATABASE_KEY: process.env.MONGO_SECRET_KEY_CONNECT,
  SECRET_KEY: process.env.JWT_SECRET_KEY,
  EXPIRES: process.env.EXPIRES,
};
