const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");

const getAdminStatistics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    const totalProducts = await Product.countDocuments();

    const deliveredOrders = await Order.find({
      status: "delivered",
    });

    const totalRevenue = deliveredOrders.reduce((sum, order) => {
      return sum + Number(order.totalPrice || 0);
    }, 0);

    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const processingOrders = await Order.countDocuments({
      status: "processing",
    });
    const shippingOrders = await Order.countDocuments({ status: "shipping" });
    const deliveredOrdersCount = await Order.countDocuments({
      status: "delivered",
    });
    const cancelledOrders = await Order.countDocuments({
      status: "cancelled",
    });

    const lowStockProducts = await Product.find({
      $expr: {
        $lte: ["$countInStock", "$lowStockThreshold"],
      },
    })
      .select("name images category price countInStock lowStockThreshold")
      .sort({ countInStock: 1 })
      .limit(10);

    const outOfStockProducts = await Product.countDocuments({
      countInStock: 0,
    });

    const latestOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const today = new Date();
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const revenueLast7Days = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: {
            $gte: sevenDaysAgo,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%d/%m",
              date: "$createdAt",
            },
          },
          revenue: {
            $sum: "$totalPrice",
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      summary: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        outOfStockProducts,
        lowStockCount: lowStockProducts.length,
      },
      orderStatus: {
        pending: pendingOrders,
        processing: processingOrders,
        shipping: shippingOrders,
        delivered: deliveredOrdersCount,
        cancelled: cancelledOrders,
      },
      revenueLast7Days,
      lowStockProducts,
      latestOrders,
    });
  } catch (error) {
    console.error("GET ADMIN STATISTICS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi lấy dữ liệu thống kê",
    });
  }
};

module.exports = {
  getAdminStatistics,
};
