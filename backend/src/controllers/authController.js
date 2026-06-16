// src/controllers/authController.js
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Đăng ký tài khoản mới
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu",
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu xác nhận không khớp",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email này đã được đăng ký sử dụng",
      });
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      address,
      role: "customer",
      status: "active",
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.log("=== REGISTER ERROR ===");
    console.error(error);
    console.log("======================");

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Đăng nhập tài khoản
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email và mật khẩu",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác",
      });
    }

    // Chặn đăng nhập nếu tài khoản bị admin/staff tạm khóa
    if (user.status === "locked") {
      return res.status(403).json({
        success: false,
        message: user.lockReason
          ? `Tài khoản của bạn đã bị tạm khóa. Lý do: ${user.lockReason}`
          : "Tài khoản của bạn đã bị tạm khóa",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi Server: " + error.message,
    });
  }
};

// @desc    Lấy thông tin profile người dùng hiện tại
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        address: req.user.address,
        role: req.user.role,
        status: req.user.status || "active",
        lockReason: req.user.lockReason || "",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi Server: " + error.message,
    });
  }
};

// @desc    Cập nhật profile người dùng
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: {
        id: updatedUser._id,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        status: updatedUser.status || "active",
        lockReason: updatedUser.lockReason || "",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi cập nhật profile: " + error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
  updateProfile,
};
