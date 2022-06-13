const express = require("express");
const router = express.Router();
const restrict = require("../middlewares/restrict");

router.get("/", (req, res) => {
  res.render("game", {
    cssFile: "game.css",
    pageTitle: "FSW - Game",
  });
});

module.exports = router;
