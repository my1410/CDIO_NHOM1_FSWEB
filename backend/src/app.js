// src/app.js
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// Middlewares cơ bản
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối các ngõ API tổng
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);

// Trang chào mừng mặc định
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Fashion AI E-commerce Backend API!" });
});

// Middlewares xử lý lỗi (Bắt buộc phải đặt SAU các tuyến đường route)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
