const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  confirmOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middlewares/authMiddleware");

// Test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Order routes hoạt động",
  });
});

// User tạo đơn
router.post("/", protect, createOrder);

// User xem đơn của mình
router.get("/myorders", protect, getMyOrders);

// Admin xem tất cả đơn
router.get("/", protect, authorize("admin", "staff"), getAllOrders);

// Admin xác nhận đơn: pending -> processing + trừ kho
router.put("/:id/confirm", protect, authorize("admin", "staff"), confirmOrder);

// Admin cập nhật trạng thái đơn hàng
router.put(
  "/:id/status",
  protect,
  authorize("admin", "staff"),
  updateOrderStatus,
);

// Xem chi tiết đơn hàng
router.get("/:id", protect, getOrderById);

module.exports = router;
