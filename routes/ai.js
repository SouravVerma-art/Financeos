const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { ensureAuth } = require("../middlewares/auth");

router.get("/", ensureAuth, aiController.getAIPage);
router.post("/chat", ensureAuth, aiController.postChat);

module.exports = router;
