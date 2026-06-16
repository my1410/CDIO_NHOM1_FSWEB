const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

const normalizeOrderItems = (orderItems = []) => {
  return orderItems.map((item) => ({
    name: item.name,
    qty: item.qty || item.quantity || 1,
    image: item.image || item.images?.[0] || "",
    price: item.price || 0,
    size: item.size || "",
    color: item.color || "",
    product: item.product || item.productId || item._id || item.id,
  }));
};

const checkStockBeforeConfirm = async (order) => {
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      return {
        success: false,
        message: `Không tìm thấy sản phẩm: ${item.name}`,
      };
    }

    if (Number(product.countInStock || 0) < Number(item.qty || 0)) {
      return {
        success: false,
        message: `Sản phẩm "${product.name}" không đủ tồn kho. Hiện còn ${product.countInStock}, cần ${item.qty}.`,
      };
    }
  }

  return {
    success: true,
  };
};

const deductStock = async (order) => {
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        countInStock: -Number(item.qty || 0),
      },
    });
  }
};

const restoreStock = async (order) => {
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        countInStock: Number(item.qty || 0),
      },
    });
  }
};

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng đang trống",
      });
    }

    const formattedItems = normalizeOrderItems(orderItems);

    const order = await Order.create({
      user: req.user._id,
      orderItems: formattedItems,
      shippingAddress,
      totalPrice,
      status: "pending",
      stockDeducted: false,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo đơn hàng thành công. Đơn hàng đang chờ admin xác nhận.",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi tạo đơn hàng",
    });
  }
};

// @desc    Lấy đơn hàng của người dùng hiện tại
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi tải đơn hàng của bạn",
    });
  }
};

// @desc    Admin lấy tất cả đơn hàng
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email phone")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi tải danh sách đơn hàng",
    });
  }
};

// @desc    Lấy chi tiết đơn hàng
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email phone",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("GET ORDER DETAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi tải chi tiết đơn hàng",
    });
  }
};

// @desc    Admin xác nhận đơn hàng, chuyển pending -> processing và trừ kho
// @route   PUT /api/orders/:id/confirm
const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Chỉ có thể xác nhận đơn hàng đang chờ duyệt",
      });
    }

    if (order.stockDeducted) {
      return res.status(400).json({
        success: false,
        message: "Đơn hàng này đã được trừ kho trước đó",
      });
    }

    const stockCheck = await checkStockBeforeConfirm(order);

    if (!stockCheck.success) {
      return res.status(400).json(stockCheck);
    }

    await deductStock(order);

    order.status = "processing";
    order.stockDeducted = true;
    order.processedAt = new Date();

    await order.save();

    const updatedOrder = await Order.findById(order._id).populate(
      "user",
      "name email phone",
    );

    return res.status(200).json({
      success: true,
      message: "Đã xác nhận đơn hàng và tự động trừ tồn kho",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("CONFIRM ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi xác nhận đơn hàng",
    });
  }
};

// @desc    Admin cập nhật trạng thái đơn hàng
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, cancelledReason } = req.body;

    const allowedStatus = [
      "pending",
      "processing",
      "shipping",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái đơn hàng không hợp lệ",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (order.status === "delivered" && status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Không thể hủy đơn hàng đã giao",
      });
    }

    if (status === "processing" && order.status === "pending") {
      const stockCheck = await checkStockBeforeConfirm(order);

      if (!stockCheck.success) {
        return res.status(400).json(stockCheck);
      }

      await deductStock(order);

      order.stockDeducted = true;
      order.processedAt = new Date();
    }

    if (status === "shipping") {
      if (!trackingNumber && !order.trackingNumber) {
        return res.status(400).json({
          success: false,
          message:
            "Vui lòng nhập mã vận đơn khi chuyển sang trạng thái Đang giao",
        });
      }

      order.trackingNumber = trackingNumber || order.trackingNumber;
      order.shippedAt = new Date();
    }

    if (status === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    if (status === "cancelled") {
      if (order.stockDeducted) {
        await restoreStock(order);
        order.stockDeducted = false;
      }

      order.cancelledAt = new Date();
      order.cancelledReason = cancelledReason || "Admin hủy đơn hàng";
    }

    order.status = status;

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id).populate(
      "user",
      "name email phone",
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi cập nhật trạng thái đơn hàng",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  confirmOrder,
  updateOrderStatus,
};
