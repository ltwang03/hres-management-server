const User = require("../../models/user.model");
const Restaurant = require("../../models/restaurant.model");
const jsonwebtoken = require("jsonwebtoken");
const { SECRET_KEY, EXPIRES } = require("../../config");
const handleError = require("../../utils/handleError");
const bcrypt = require("bcrypt");

class AuthController {
  async registerManager(req, res, next) {
    //lấy dũ liệu từ input
    const { restaurantID, userName, password, role } = req.body;
    console.log(restaurantID);
    try {
      //check dữ liệu nhập vào đầy đủ hay không
      if (!restaurantID || !userName || !password || !role)
        return next(new handleError({}, "Vui lòng nhập đầy đủ thông tin", 500));
      const convertRestaurantID = restaurantID.split(" ").join("");
      const checkUniqueUser = await User.findOne({ $or: [{ userName }] });
      // kiểm tra đã có tài khoản trùng chưa
      if (checkUniqueUser) {
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
        res.json({
          status: "failed",
          message: "có lỗi xảy ra trong quá trình đăng ký tài khoản",
          error: e,
        })
      );
    }
  }

  async login(req, res, next) {
    const { restaurantID, userName, password } = req.body;
    try {
      if (!restaurantID || !userName || !password)
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
          restaurantID: infoUser.restaurantID,
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
