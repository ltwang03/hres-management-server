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
      if (
        !resourceID ||
        !name ||
        !category ||
        !describe ||
        !price ||
        !product_id
      )
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
  async deleteDataFood(req, res, next) {
    const { infoUser } = res.locals;
    const { product_id } = req.body;
    try {
      if (!infoUser)
        return next(new handleError({}, "không tìm thấy người dùng!", 401));
      if (!product_id)
        return next(new handleError({}, "không tìm thấy món ăn để xóa!", 404));
      if (infoUser.role === "staff")
        return next(
          new handleError(
            {},
            "bạn không đủ quyền để sử dụng chức năng này!!",
            403
          )
        );
      const deleteFood = await Restaurant.findOneAndUpdate(
        {
          name: infoUser.restaurantID,
        },
        { $pull: { food: { product_id } } },
        { new: true }
      );
      if (!deleteFood) return next(new handleError({}, "không thể xóa!!", 404));
      res.json({
        status: "xóa thành công!",
      });
    } catch (e) {
      next(new handleError(e, "đồng bộ dữ liệu không thành công!!", 500));
    }
  }
}

module.exports = new dataSqliteController();
