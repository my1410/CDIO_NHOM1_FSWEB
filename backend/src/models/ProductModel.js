const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Khách hàng",
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên sản phẩm"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Vui lòng nhập mô tả sản phẩm"],
    },

    price: {
      type: Number,
      required: [true, "Vui lòng nhập giá sản phẩm"],
      default: 0,
    },

    images: {
      type: [String],
      required: true,
      default: [],
    },

    category: {
      type: String,
      required: [true, "Vui lòng chọn danh mục sản phẩm"],
    },

    gender: {
      type: String,
      enum: ["men", "women", "unisex"],
      default: "unisex",
    },

    isSale: {
      type: Boolean,
      default: false,
    },

    discount: {
      type: Number,
      default: 0,
    },

    sizes: {
      type: [String],
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    countInStock: {
      type: Number,
      required: [true, "Vui lòng nhập số lượng tồn kho"],
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ProductModel", ProductSchema);
