const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  createProductReview,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Danh sách + thêm sản phẩm
router.route("/").get(getProducts).post(createProduct);

// Review
router.post("/:id/reviews", createProductReview);

// Chi tiết + cập nhật + xóa
router
  .route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
