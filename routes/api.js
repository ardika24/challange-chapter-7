const router = require("express").Router();
const apiController = require("../controllers/api");
const restrict = require("../middlewares/restrict");

router.get("/login/whoami", restrict, apiController.whoami);
router.post("/login", apiController.loginApi, restrict, (req, res) => {
  res.status(200).send("login success");
});
router.post("/register", apiController.registerApi);
router.post("/create-room", restrict, apiController.createRoom);
router.post("/fight/:roomId", restrict, apiController.play);

module.exports = router;
