const express = require("express");
const router = express.Router();

const {
  getCustomers,
  getCustomerDetail,
  updateCustomerStatus,
} = require("../controllers/adminCustomerController");

const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", protect, authorize("admin", "staff"), getCustomers);

router.get("/:id", protect, authorize("admin", "staff"), getCustomerDetail);

router.put(
  "/:id/status",
  protect,
  authorize("admin", "staff"),
  updateCustomerStatus,
);

module.exports = router;
