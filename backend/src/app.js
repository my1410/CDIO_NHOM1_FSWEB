const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminCustomerRoutes = require("./routes/adminCustomerRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const statisticRoutes = require("./routes/statisticRoutes");

const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Fashion AI E-commerce Backend API!",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin/customers", adminCustomerRoutes);
app.use("/api/admin/inventory", inventoryRoutes);
app.use("/api/admin/statistics", statisticRoutes);

// notFound phải nằm cuối cùng
app.use(notFound);
app.use(errorHandler);

module.exports = app;
