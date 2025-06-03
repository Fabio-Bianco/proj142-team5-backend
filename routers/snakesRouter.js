const express = require("express");
const router = express.Router();
const snakeController = require("../controllers/snakeController");

router.get("/", snakeController.index);
router.get("/:slug", snakeController.show);

module.exports = router;