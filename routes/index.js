const express = require("express");
const router = express.Router();

const gameRoutes = require("./game");
const userRoutes = require("./user");
const bioRoutes = require("./bio");
const historyRoutes = require("./history");
const authRoutes = require("./auth");
const apiRoutes = require("./api");

router.use("/bios", bioRoutes);
router.use("/users", userRoutes);
router.use("/game", gameRoutes);
router.use("/histories", historyRoutes);
router.use("/auth", authRoutes);
router.use("/api", apiRoutes);

router.get("/", (req, res) => {
  res.render("index", {
    cssFile: "styles.css",
    pageTitle: "FSW20 - Home",
  });
});

module.exports = router;
