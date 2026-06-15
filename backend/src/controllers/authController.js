// src/controllers/authController.js
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Đăng ký tài khoản mới kèm Xác nhận mật khẩu
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    // Thêm confirmPassword vào dữ liệu bóc tách từ body
    const { name, email, password, confirmPassword, phone, address } = req.body;

    // 1. Kiểm tra tài khoản tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email này đã được đăng ký sử dụng" });
    }

    // 2. Truyền cả trường confirmPassword vào để Mongoose thực hiện validate
    const user = new User({
      name,
      email,
      password,
      confirmPassword,
      phone,
      address,
    });
    await user.save();

    // 3. Trả về thông tin kèm token thành công
    return res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // In lỗi chi tiết ra Terminal để xem file nào, dòng mấy đang bị lỗi
    console.log("=== BẮT ĐƯỢC LỖI TẠI CONTROLLER ===");
    console.error(error);
    console.log("====================================");

    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Đăng nhập tài khoản
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc Mật khẩu không chính xác",
      });
    }

    // 2. Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc Mật khẩu không chính xác",
      });
    }

    // 3. Đúng mật khẩu -> Trả về token và thông tin user cho React
    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi Server: " + error.message });
  }
};

// Thêm hàm này vào cuối file src/controllers/authController.js của bạn

// @desc    Lấy thông tin profile người dùng hiện tại
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    // req.user đã được gán dữ liệu từ middleware protect
    if (req.user) {
      return res.status(200).json({
        success: true,
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          isAdmin: req.user.isAdmin || false,
        },
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi Server: " + error.message });
  }
};

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi cập nhật profile: " + error.message,
    });
  }
};

// Nhớ cập nhật module.exports ở cuối file để export thêm getUserProfile nhé!
// ... Toàn bộ code các hàm register, login, getUserProfile bên trên giữ nguyên ...

// CHỈ GIỮ LẠI DUY NHẤT MỘT KHỐI EXPORT NÀY Ở CUỐI FILE:
module.exports = {
  register,
  login,
  getUserProfile,
  updateProfile,
};
