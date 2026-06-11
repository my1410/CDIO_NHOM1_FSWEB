const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decoded.id || decoded._id || decoded.userId;

      req.user = await User.findById(userId).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Tài khoản không tồn tại",
        });
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: "Yêu cầu bị chặn! Không tìm thấy Token xác thực người dùng.",
  });
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập",
      });
    }

    next();
  };
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Chỉ admin mới được truy cập",
  });
};

module.exports = {
  protect,
  authorize,
  admin,
};
