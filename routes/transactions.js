const express = require("express");
const router = express.Router();
const txController = require("../controllers/transactionController");
const { ensureAuth } = require("../middlewares/auth");

router.get("/", ensureAuth, txController.getTransactions);
router.get("/new", ensureAuth, txController.getNewTransaction);
router.post("/", ensureAuth, txController.postTransaction);
router.get("/stats", ensureAuth, txController.getStats);
router.get("/:id/edit", ensureAuth, txController.getEditTransaction);
router.put("/:id", ensureAuth, txController.putTransaction);
router.delete("/:id", ensureAuth, txController.deleteTransaction);

module.exports = router;
