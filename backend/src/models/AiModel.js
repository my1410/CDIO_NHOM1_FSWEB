// src/models/AiModel.js

const mongoose = require("mongoose");

const AiSchema = new mongoose.Schema(
  {
    // Người sử dụng AI
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Câu hỏi hoặc yêu cầu của khách hàng
    stylePreferences: {
      type: String,
      required: true,
      trim: true,
    },

    // AI phản hồi
    aiFeedback: {
      type: String,
      default: "",
    },

    // Danh sách sản phẩm AI gợi ý
    recommendations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // Lưu model AI đã sử dụng
    aiModel: {
      type: String,
      default: "Gemini",
    },

    // Trạng thái xử lý
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Ai", AiSchema);
