const express = require("express");
const router = express.Router();

const { getAdminStatistics } = require("../controllers/statisticController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Statistic routes hoạt động",
  });
});

// Admin xem thống kê
router.get("/", protect, authorize("admin"), getAdminStatistics);

module.exports = router;
