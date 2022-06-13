const router = require("express").Router();
const authController = require("../controllers/auth");

router.get("/register", authController.register);
router.post("/register", authController.registerLocal);
router.get("/login", authController.loginForm);
router.post("/login", authController.loginLocal);

module.exports = router;
