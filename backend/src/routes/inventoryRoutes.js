const express = require("express");
const router = express.Router();

const {
  getInventorySummary,
  getInventoryTransactions,
  createInventoryTransaction,
} = require("../controllers/inventoryController");

const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", protect, authorize("admin", "staff"), getInventorySummary);

router.get(
  "/transactions",
  protect,
  authorize("admin", "staff"),
  getInventoryTransactions,
);

router.post(
  "/transactions",
  protect,
  authorize("admin", "staff"),
  createInventoryTransaction,
);

module.exports = router;
