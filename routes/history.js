const express = require("express");
const router = express.Router();
const historyControllers = require("../controllers/history");

router.get("/", historyControllers.getHistories);
router.get("/:id/edit", historyControllers.getHistory);
router.get("/add", historyControllers.getCreateHistory);
router.post("/", historyControllers.postCreateHistory);
router.put("/:id", historyControllers.putUpdateHistory);
router.delete("/:id", historyControllers.deleteHistory);

module.exports = router;
