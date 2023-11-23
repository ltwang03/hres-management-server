const { Router } = require("express");

const AuthController = require("../controllers/auth.controller");
const AuthMiddleWare = require("../middlewares/auth.middleware");

const router = Router();

router.post("/register/manager", AuthController.registerManager);
router.post("/register/staff", AuthController.registerStaff);
router.post("/login", AuthController.login);
router.get(
  "/get/user",
  AuthMiddleWare.CheckAuth,
  AuthController.getUserRestaurant
);
router.get("/get/profile", AuthMiddleWare.CheckAuth, AuthController.getProfile);
router.put(
  "/edit/profile",
  AuthMiddleWare.CheckAuth,
  AuthController.editProfile
);
router.delete(
  "/delete/user",
  AuthMiddleWare.CheckAuth,
  AuthController.deleteUser
);
router.post(
  "/post/customer",
  AuthMiddleWare.CheckAuth,
  AuthController.createCustomer
);
router.delete(
  "/delete/customer/:id",
  AuthMiddleWare.CheckAuth,
  AuthController.deleteCustomer
);
router.get(
  "/get/customers",
  AuthMiddleWare.CheckAuth,
  AuthController.getAllCustomerByIdRestaurant
);
router.patch(
  "/patch/customer/:id",
  AuthMiddleWare.CheckAuth,
  AuthController.EditCustomerById
);
router.get(
  "/search/customer/:text",
  AuthMiddleWare.CheckAuth,
  AuthController.searchUserByText
);
module.exports = router;
