const { Router } = require("express");

const AuthController = require("../controllers/auth.controller");

const router = Router();

router.post("/register/manager", AuthController.registerManager);
router.post("/login", AuthController.login);

module.exports = router;
