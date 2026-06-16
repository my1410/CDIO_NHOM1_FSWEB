const User = require("../models/UserModel");
const Order = require("../models/OrderModel");
const CustomerLog = require("../models/CustomerLogModel");

const isCustomerAccount = (user) => {
  return user.role !== "admin" && user.role !== "staff";
};

// GET /api/admin/customers
const getCustomers = async (req, res) => {
  try {
    const { search } = req.query;

    const query = {
      role: {
        $nin: ["admin", "staff"],
      },
    };

    if (search && search.trim()) {
      query.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          email: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    const customers = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("GET CUSTOMERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi tải danh sách khách hàng",
    });
  }
};

// GET /api/admin/customers/:id
const getCustomerDetail = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id)
      .select("-password")
      .populate("statusUpdatedBy", "name email role")
      .lean();

    if (!customer || !isCustomerAccount(customer)) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khách hàng",
      });
    }

    const orders = await Order.find({
      user: req.params.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const logs = await CustomerLog.find({
      customer: req.params.id,
    })
      .populate("changedBy", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      customer,
      orders,
      logs,
    });
  } catch (error) {
    console.error("GET CUSTOMER DETAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi tải chi tiết khách hàng",
    });
  }
};

// PUT /api/admin/customers/:id/status
const updateCustomerStatus = async (req, res) => {
  try {
    const { status, lockReason } = req.body;

    if (!["active", "locked"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    if (status === "locked" && !lockReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập lý do khóa tài khoản",
      });
    }

    const customer = await User.findById(req.params.id);

    if (!customer || customer.role === "admin" || customer.role === "staff") {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khách hàng",
      });
    }

    const oldStatus = customer.status || "active";

    customer.status = status;
    customer.lockReason = status === "locked" ? lockReason.trim() : "";
    customer.statusUpdatedAt = new Date();
    customer.statusUpdatedBy = req.user._id;

    // Nếu user cũ chưa có role thì tự gán lại customer
    if (!customer.role) {
      customer.role = "customer";
    }

    await customer.save();

    let action = "UPDATE_CUSTOMER_STATUS";

    if (oldStatus !== status && status === "locked") {
      action = "LOCK_CUSTOMER";
    }

    if (oldStatus !== status && status === "active") {
      action = "UNLOCK_CUSTOMER";
    }

    await CustomerLog.create({
      customer: customer._id,
      changedBy: req.user._id,
      action,
      oldStatus,
      newStatus: status,
      reason:
        status === "locked" ? lockReason.trim() : "Kích hoạt lại tài khoản",
    });

    const updatedCustomer = await User.findById(customer._id).select(
      "-password",
    );

    return res.status(200).json({
      success: true,
      message:
        status === "locked"
          ? "Đã tạm khóa tài khoản khách hàng"
          : "Đã kích hoạt tài khoản khách hàng",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("UPDATE CUSTOMER STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi cập nhật trạng thái khách hàng",
    });
  }
};

module.exports = {
  getCustomers,
  getCustomerDetail,
  updateCustomerStatus,
};
