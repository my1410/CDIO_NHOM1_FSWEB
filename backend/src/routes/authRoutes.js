const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUserProfile,
  updateProfile,
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/register", register);

router.post("/login", login);

router.get("/profile", protect, getUserProfile);

router.put("/profile", protect, updateProfile);

module.exports = router;
