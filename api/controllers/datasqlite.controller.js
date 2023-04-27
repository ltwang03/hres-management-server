const Restaurant = require("../../models/restaurant.model");
const handleError = require("../../utils/handleError");

class dataSqliteController {
  async updateDataFood(req, res, next) {
    const { product_id, resourceID, name, category, describe, price } =
      req.body;
    const { infoUser } = res.locals;
    try {
      if (!infoUser)
        return next(new handleError({}, "bạn chưa đăng nhập!", 401));
      if (!resourceID || !name || !category || !describe || !price)
        return next(
          new handleError({}, "vui lòng nhập thông tin đầy đủ!", 422)
        );
      const restaurantInfo = await Restaurant.findOne({
        name: infoUser.restaurantID,
      });
      if (!restaurantInfo)
        return next(
          new handleError({}, "Nhà hàng không tồn tại trong hệ thống"),
          422
        );
      await Restaurant.updateOne(
        { name: infoUser.restaurantID },
        {
          $push: {
            food: {
              product_id,
              resourceID,
              name,
              category,
              describe,
              price,
            },
          },
        }
      );
      res.json({
        status: "thêm thành công!",
      });
    } catch (e) {
      next(
        new handleError(e, "có vấn đề với server, vui lòng thử lại sau!", 500)
      );
    }
  }
  async getDataFood(req, res, next) {
    const { infoUser } = res.locals;
    try {
      if (!infoUser)
        return next(new handleError({}, "bạn chưa đăng nhập!!!", 401));
      const restaurantInfo = await Restaurant.find({
        name: infoUser.restaurantID,
      });
      if (!restaurantInfo) {
        return next(new handleError({}, "nhà hàng không tồn tại!!!", 422));
      }
      res.json({
        status: "success",
        food: restaurantInfo[0].food,
      });
    } catch (e) {
      next(new handleError(e, " có lỗi xảy ra vui lòng thử lại sau!", 500));
    }
  }
}

module.exports = new dataSqliteController();
