const User = require("../../models/user.model");
const jsonwebtoken = require("jsonwebtoken");
const { SECRET_KEY, EXPIRES } = require("../../config");
const handleError = require("../../utils/handleError");
const bcrypt = require("bcrypt");

class AuthController {
  async register(req, res, next) {
    //lấy dũ liệu từ input
    const { restaurantName, userName, password, email, role } = req.body;
    try {
      //check dữ liệu nhập vào đầy đủ hay không
      if (!restaurantName || !userName || !password || !email || !role)
        return next(new handleError({}, "Vui lòng nhập đầy đủ thông tin", 500));
      const checkUniqueUser = await User.findOne({ userName });
      // check dữ liệu có trong database hay chưa
      if (checkUniqueUser)
        return next(
          new handleError({}, "Tài Khoản đã tồn tại trong hệ thống", 500)
        );
      // mã hóa mật khẩu khi đăng ký thành công
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        restaurantName,
        userName,
        password: hashPassword,
        email,
        role,
      });
      await newUser.save();
      // trả về msg thành công
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
  async login(req, res, next) {
    const { restaurantName, userName, password } = req.body;
    try {
      if (!restaurantName || !userName || !password)
        return next(new handleError({}, "Vui lòng nhập đầy đủ thông tin", 500));
      const infoUser = await User.findOne({ userName });
      if (!infoUser)
        return next(
          new handleError({}, "tài khoản không tồn tại trong hệ thống!", 500)
        );
      const comparePassword = await bcrypt.compare(password, infoUser.password);
      if (!comparePassword)
        return next(new handleError({}, "sai tài khoản hoặc mật khẩu!", 500));
      const token = jsonwebtoken.sign(
        {
          userName: infoUser.userName,
          restaurantName: infoUser.restaurantName,
        },
        SECRET_KEY,
        { expiresIn: EXPIRES }
      );
      res.json({
        status: "success",
        message: "Đăng nhập thành công",
        userName,
        token,
      });
    } catch (error) {
      next(new handleError(error, "có lỗi trong quá trình đăng nhập", 500));
    }
  }
}

module.exports = new AuthController();
