const express = require("express");
const router = express.Router();
const bioControllers = require("../controllers/bio");

router.get("/add", bioControllers.getCreateBio);
router.get("/:id/edit", bioControllers.getBio);
router.get("/", bioControllers.getBios);
router.post("/", bioControllers.postCreateBio);
router.put("/:id", bioControllers.putUpdateBio);
router.delete("/:id", bioControllers.deleteBio);

module.exports = router;
