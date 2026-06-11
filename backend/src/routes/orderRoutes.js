const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
} = require("../controllers/orderController");

const { protect, admin } = require("../middlewares/authMiddleware");

router.post("/", protect, createOrder);

router.get("/myorders", protect, getMyOrders);

router.get("/", protect, admin, getAllOrders);

module.exports = router;
