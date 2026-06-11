// src/models/UserModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Vui lòng nhập tên"] },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email không hợp lệ",
      ],
    },
    password: {
      type: String,
      required: [true, "Vui lòng nhập mật khẩu"],
      minlength: [6, "Mật khẩu phải từ 6 ký tự trở lên"],
    },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    role: {
      type: String,
      enum: ["customer", "staff", "admin"],
      default: "customer",
    },
  },
  { timestamps: true },
);

// 1. [HASH] Tự động băm mật khẩu trước khi lưu vào MongoDB
// 🌟 SỬA TẠI ĐÂY: Xóa 'next' khỏi tham số hàm và không gọi 'next()' ở bên trong nữa
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error; // Mongoose tự động bắt lỗi này và đẩy vào errorHandler
  }
});

// 2. [COMPARE] Hàm hỗ trợ so sánh mật khẩu khi đăng nhập
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("UserModel", UserSchema);
