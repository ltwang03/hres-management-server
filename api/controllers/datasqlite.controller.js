const User = require("../../models/user.model");
const Restaurant = require("../../models/restaurant.model");
const handleError = require("../../utils/handleError");

class datasqliteController {
  async updateData(req, res, next) {
    const { message, dataFood } = req.body;
    const { infoUser } = res.locals;
    try {
      if (!message || !dataFood) {
        next(new handleError({}, "không có dữ liệu!"));
      }
      const restaurantInfo = await Restaurant.findOneAndUpdate({
        name: infoUser.restaurantID,
      });
      if (!restaurantInfo) {
        next(new handleError({}, "không tìm thấy nhà hàng của bạn!"));
      }
    } catch (e) {
      next(new handleError(e, "Có lỗi trong quá trình cập nhật", 500));
    }
  }
}

module.exports = new datasqliteController();
