const jsonwebtoken = require("jsonwebtoken");
const User = require("../../models/user.model");
const handleError = require("../../utils/handleError");
const { SECRET_KEY } = require("../../config");

class AuthMiddleware {
  async CheckAuth(req, res, next) {
    const throwError = new handleError({}, "Vui lòng đăng nhập lại!", 401);
    const authorization = req.get("Authorization");

    if (!authorization || !authorization.startsWith("Bearer"))
      return next(throwError);
    const token = authorization.split(" ")[1];
    try {
      const decoded = jsonwebtoken.decode(token, SECRET_KEY);
      if (!decoded) return next(throwError);
      const infoUser = await User.findOne({ userName: decoded.userName });
      if (!infoUser)
        return next(new handleError({}, "không tồn tại tài khoản", 401));
      res.locals.infoUser = infoUser;
      next();
    } catch (e) {
      next(new handleError(e, "Vui lòng đăng nhập lại!", 401));
    }
  }
}

module.exports = new AuthMiddleware();
