const express = require("express");
const router = express.Router();
const UserControllers = require("../controllers/user");

router.get("/:id/bio", UserControllers.getBio);
router.get("/:id/edit", UserControllers.getUser);
router.get("/add", UserControllers.getCreateUser);
router.get("/:id/histories", UserControllers.getHistory);
router.get("/", UserControllers.getUsers);
router.post("/", UserControllers.postCreateUser);
router.put("/:id", UserControllers.putUpdateUser);
router.delete("/:id", UserControllers.deleteUser);
// router.get("/register", UserControllers.getRegister);
// router.post("/register", UserControllers.postReqUser);
// router.post("/auth", UserControllers.postAuthUser);
// router.get("/login", UserControllers.getLogin);

module.exports = router;
