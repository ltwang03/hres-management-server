const { Router } = require("express");
const router = Router();

const AuthMiddleWare = require("../middlewares/auth.middleware");
const SqliteController = require("../controllers/datasqlite.controller");

router.post(
  "/post/food",
  AuthMiddleWare.CheckAuth,
  SqliteController.updateDataFood
);
router.get("/get/food", AuthMiddleWare.CheckAuth, SqliteController.getDataFood);
module.exports = router;
