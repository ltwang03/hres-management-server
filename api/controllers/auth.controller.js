const User = require("../../models/user.model");
const jsonwebtoken = require("jsonwebtoken");
const { SECRET_KEY, EXPIRES } = require("../../config");
const handleError = require("../../utils/handleError");
const bcrypt = require("bcrypt");

class AuthController {
  async register(req, res, next) {
    const { restaurantName, userName, password, email } = req.body;
    try {
      if (!restaurantName || !userName || !password || !email)
        return next(new handleError({}, "Vui lòng nhập đầy đủ thông tin", 500));
      const checkUniqueUser = await User.findOne({ userName });
      if (checkUniqueUser)
        return next(
          new handleError({}, "Tài Khoản đã tồn tại trong hệ thống", 500)
        );
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        restaurantName,
        userName,
        password: hashPassword,
        email,
      });
      await newUser.save();
      res.json({
        status: "success",
        message: "Tạo tài khoản thành công !",
      });
      next();
    } catch (e) {
      next(
        new handleError(
          e,
          "Có lỗi xảy ra trong quá trình đăng ký tài khoản",
          500
        )
      );
    }
  }
}

module.exports = new AuthController();
