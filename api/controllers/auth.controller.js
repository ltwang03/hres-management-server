const User = require("../../models/user.model");
const Restaurant = require("../../models/restaurant.model");
const jsonwebtoken = require("jsonwebtoken");
const { SECRET_KEY, EXPIRES } = require("../../config");
const handleError = require("../../utils/handleError");
const bcrypt = require("bcrypt");

class AuthController {
  async registerManager(req, res, next) {
    //lấy dũ liệu từ input
    const { restaurantID, userName, password, role, phoneNumber, fullName } =
      req.body;
    try {
      //check dữ liệu nhập vào đầy đủ hay không
      if (
        !restaurantID ||
        !userName ||
        !password ||
        !role ||
        !phoneNumber ||
        !fullName
      )
        return next(new handleError({}, "Vui lòng nhập đầy đủ thông tin", 500));
      const convertRestaurantID = restaurantID.split(" ").join("");
      const checkUniqueUser = await User.findOne({
        $or: [{ userName }, { phoneNumber }],
      });
      // kiểm tra đã có tài khoản trùng chưa
      if (checkUniqueUser) {
        return next(
          new handleError({}, "Tài Khoản đã tồn tại trong hệ thống", 500)
        );
      }
      // kiểm tra nhà hàng có trong danh sách
      const restaurantInfo = await Restaurant.findOne({
        name: convertRestaurantID,
      });
      if (restaurantInfo) {
        next(new handleError({}, "Nhà hàng đã tồn tại trong hệ thống", 422));
      } else {
        // mã hóa mật khẩu khi đăng ký thành công
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          restaurantID: convertRestaurantID,
          fullName,
          userName,
          phoneNumber,
          password: hashPassword,
          role: "manager",
        });
        await newUser.save();

        const newRestaurant = new Restaurant({
          name: restaurantID,
          user: fullName,
        });
        await newRestaurant.save();
        // trả về msg thành công
        res.json({
          status: "success",
          message: "Tạo tài khoản thành công !",
        });
        next();
      }
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
  async registerStaff(req, res, next) {
    const { restaurantID, userName, password, role, phoneNumber, fullName } =
      req.body;
    try {
      if (
        !restaurantID ||
        !userName ||
        !password ||
        !role ||
        !phoneNumber ||
        !fullName
      ) {
        next(new handleError({}, "Vui lòng nhập đầy đủ thông tin!", 500));
      }
      const userInfo = await User.findOne({
        $or: [{ userName }, { phoneNumber }],
      });
      if (userInfo) {
        return next(
          new handleError({}, "Tài khoản đã tồn tại trong hệ thống", 422)
        );
      }
      const restaurantInfo = await Restaurant.findOne({ name: restaurantID });
      if (!restaurantInfo) {
        return next(
          new handleError(
            {},
            "nhà hàng không tồn tại trong hệ thống vui lòng nhập chính xác tên nhà hàng!",
            422
          )
        );
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        restaurantID,
        userName,
        password: hashPassword,
        role: "staff",
        phoneNumber,
        fullName,
      });
      await newUser.save();
      await Restaurant.updateOne(
        { name: restaurantID },
        {
          $push: {
            user: fullName,
          },
        }
      );
      res.json({
        status: "Successfully",
        message: "Đăng Ký Thành Công",
      });
    } catch (e) {
      console.log(e);
      next(new handleError({ e }, "có lỗi trong quá trình đăng ký", 500));
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
      const restaurantInfo = await Restaurant.findOne({ name: restaurantID });
      if (!restaurantInfo) {
        return next(
          new handleError({}, "ID Nhà Hàng không có trong hệ thống", 422)
        );
      }
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
      return res.json({
        status: "success",
        message: "Đăng nhập thành công",
        role: infoUser.role,
        userName,
        token,
      });
    } catch (error) {
      next(new handleError(error, "Có vấn đề xảy ra khi đăng nhập", 500));
    }
  }
  async getUserRestaurant(req, res, next) {
    const errorHandled = new handleError(
      {},
      "có lỗi xảy ra với server vui lòng thử lại sau!",
      500
    );
    try {
      const { infoUser } = res.locals;
      if (!infoUser) next(errorHandled);
      const restaurantInfo = await Restaurant.find({
        name: infoUser.restaurantID,
      });
      if (!restaurantInfo) next(errorHandled);
      // console.log(infoUser);
      res.json({
        status: "success",
        user: restaurantInfo[0]?.user,
      });
    } catch (e) {
      next(
        new handleError(
          e,
          "Có vấn đề xảy ra với server vui lòng thử lại sau!",
          500
        )
      );
    }
  }
}
module.exports = new AuthController();
