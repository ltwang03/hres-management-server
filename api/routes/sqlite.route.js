const { Router } = require("express");
const router = Router();

const AuthMiddleWare = require("../middlewares/auth.middleware");
const SqliteController = require("../controllers/datasqlite.controller");

router.post(
  "/post/food",
  AuthMiddleWare.CheckAuth,
  SqliteController.postDataFood
);
router.get("/get/food", AuthMiddleWare.CheckAuth, SqliteController.getDataFood);
router.delete(
  "/delete/food",
  AuthMiddleWare.CheckAuth,
  SqliteController.deleteDataFood
);
router.put(
  "/update/food",
  AuthMiddleWare.CheckAuth,
  SqliteController.updateDataFood
);
module.exports = router;
