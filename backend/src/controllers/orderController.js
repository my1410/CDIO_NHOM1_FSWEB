// src/controllers/orderController.js
const Order = require("../models/OrderModel");

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Giỏ hàng trống" });
    }

    const order = new Order({
      user: req.user._id || req.user.id || req.user,
      orderItems,
      shippingAddress,
      totalPrice,
    });

    const createdOrder = await order.save();
    return res
      .status(201)
      .json({
        success: true,
        message: "Đặt hàng thành công!",
        order: createdOrder,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi tạo đơn hàng: " + error.message });
  }
};

// @desc    Lấy lịch sử đơn hàng của người dùng đang đăng nhập
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user;
    const orders = await Order.find({ user: userId });
    return res
      .status(200)
      .json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi lấy đơn hàng: " + error.message });
  }
};

// @desc    Lấy TOÀN BỘ đơn hàng (Dành cho Admin)
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name email");
    return res
      .status(200)
      .json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi Server: " + error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders };
