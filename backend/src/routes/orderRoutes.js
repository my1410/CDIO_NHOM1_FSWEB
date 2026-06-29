const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  confirmOrder,
  updateOrderStatus,
  cancelMyOrder,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middlewares/authMiddleware");

// Test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Order routes hoạt động",
  });
});

// Khách hàng tạo đơn hàng
router.post("/", protect, createOrder);

// Khách hàng xem đơn hàng của mình
router.get("/myorders", protect, getMyOrders);

// Admin xem tất cả đơn hàng
router.get("/", protect, authorize("admin"), getAllOrders);

// Khách hàng hủy đơn hàng của mình
router.put("/:id/cancel", protect, cancelMyOrder);

// Admin xác nhận đơn hàng
router.put("/:id/confirm", protect, authorize("admin"), confirmOrder);

// Admin cập nhật trạng thái đơn hàng
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

// Xem chi tiết đơn hàng
router.get("/:id", protect, getOrderById);

module.exports = router;
