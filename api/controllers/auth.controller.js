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
          user: {
            userName,
            fullName,
            phoneNumber,
          },
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
      next(new handleError(e, "có lỗi trong quá trình đăng ký", 500));
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
            user: {
              userName,
              fullName,
              phoneNumber,
            },
          },
        }
      );
      res.json({
        status: "Successfully",
        message: "Đăng Ký Thành Công",
      });
    } catch (e) {
      next(new handleError(e, "có lỗi trong quá trình đăng ký", 500));
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
        user: restaurantInfo[0].user,
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
  async getProfile(req, res, next) {
    const error = new handleError(
      {},
      " có lỗi xảy ra với server vui lòng thử lại sau!",
      500
    );
    try {
      // check locals có access token hay chưa
      const { infoUser } = res.locals;
      if (!infoUser) next(error);
      // check tên nhà hàng có trùng khớp với profile
      const restaurantInfo = await Restaurant.findOne({
        name: infoUser.restaurantID,
      });
      if (!restaurantInfo) next(error);
      // detructuring những info không cần thiết
      const { restaurantID, userName, role, fullName, phoneNumber } =
        infoUser._doc;
      res.json({
        restaurantID,
        userName,
        role,
        fullName,
        phoneNumber,
      });
    } catch (e) {
      next(new handleError(e, "có lỗi xảy ra vui lòng thử lại sau!", 500));
    }
  }
  async editProfile(req, res, next) {
    const { infoUser } = res.locals;
    const { fullName, phoneNumber } = req.body;
    try {
      if (!infoUser)
        return next(
          new handleError(
            {},
            "có lỗi xảy ra với server vui lòng thử lại sau!",
            500
          )
        );
      if (!fullName || !phoneNumber)
        return next(
          new handleError({}, "vui lòng nhập đầy đủ các thông tin!", 422)
        );
      const editProfile = await User.findOneAndUpdate(
        {
          userName: infoUser.userName,
        },
        {
          fullName,
          phoneNumber,
        }
      );
      if (!editProfile)
        return next(
          new handleError(
            {},
            " có lỗi xảy ra với server vui lòng thử lại sau!",
            500
          )
        );
      const updateUserInRestaurant = await Restaurant.findOneAndUpdate(
        {
          user: {
            $elemMatch: { userName: infoUser.userName },
          },
        },
        {
          $set: {
            "user.$.fullName": fullName,
            "user.$.phoneNumber": phoneNumber,
          },
        },
        { new: true }
      );
      if (!updateUserInRestaurant)
        return next(
          new handleError(
            {},
            "có lỗi xảy ra với server vui lòng thử lại sau!",
            500
          )
        );
      res.json({
        status: "chỉnh sửa thành công!",
        fullName,
        phoneNumber,
      });
    } catch (e) {
      next(new handleError(e, "có lỗi xảy ra với server", 500));
    }
  }
}
module.exports = new AuthController();
