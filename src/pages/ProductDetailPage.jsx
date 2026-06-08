import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Rate,
  InputNumber,
  Tag,
  Divider,
  Card,
  Spin,
  message,
  Form,
  Input,
  Empty,
} from "antd";
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;

const ProductDetailPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`http://localhost:5000/api/products/${id}`);

      setProduct(res.data.product);

      setSelectedSize(res.data.product.sizes?.[0] || "");
      setSelectedColor(res.data.product.colors?.[0] || "");
    } catch (error) {
      console.log("Lỗi tải sản phẩm:", error);
      console.log("Response:", error.response?.data);

      message.error(error.response?.data?.message || "Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      message.warning("Vui lòng chọn size");
      return;
    }

    if (!selectedColor) {
      message.warning("Vui lòng chọn màu sắc");
      return;
    }

    const cartItem = {
      productId: product._id,
      id: product._id,
      _id: product._id,
      name: product.name,
      price: product.price,
      image:
        product.images?.[0] ||
        product.image ||
        "https://placehold.co/600x600?text=Fashion+AI",
      size: selectedSize,
      color: selectedColor,
      quantity,
    };

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex(
      (item) =>
        (item.productId === cartItem.productId || item._id === cartItem._id) &&
        item.size === cartItem.size &&
        item.color === cartItem.color,
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    message.success("Đã thêm vào giỏ hàng");
  };

  const handleSubmitReview = async () => {
    if (!reviewRating) {
      message.warning("Vui lòng chọn số sao");
      return;
    }

    if (!reviewComment.trim()) {
      message.warning("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      setReviewLoading(true);

      const res = await axios.post(
        `http://localhost:5000/api/products/${product._id}/reviews`,
        {
          name: reviewName.trim() || "Khách hàng",
          rating: reviewRating,
          comment: reviewComment.trim(),
        },
      );

      message.success(res.data.message || "Đánh giá thành công");

      setReviewName("");
      setReviewRating(5);
      setReviewComment("");

      setProduct(res.data.product);
    } catch (error) {
      console.log("Lỗi gửi đánh giá:", error);
      console.log("Response:", error.response?.data);

      message.error(error.response?.data?.message || "Không thể gửi đánh giá");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <h2 style={{ textAlign: "center", marginTop: 80 }}>
        Không tìm thấy sản phẩm
      </h2>
    );
  }

  const productImage =
    product.images?.[0] ||
    product.image ||
    "https://placehold.co/600x600?text=Fashion+AI";

  return (
    <div
      style={{
        background: "#f5f5f5",
        minHeight: "100vh",
        padding: "50px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <Card
          style={{
            borderRadius: 30,
            border: "none",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          }}
          bodyStyle={{
            padding: 40,
          }}
        >
          <Row gutter={[50, 50]}>
            <Col xs={24} lg={12}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 25,
                  overflow: "hidden",
                }}
              >
                <img
                  src={productImage}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: 650,
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/600x600?text=Fashion+AI";
                  }}
                />
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <Tag
                color={product.isSale ? "red" : "blue"}
                style={{
                  padding: "8px 16px",
                  borderRadius: 30,
                  fontSize: 14,
                }}
              >
                {product.isSale ? `Sale ${product.discount || 0}%` : "Trending"}
              </Tag>

              <h1
                style={{
                  marginTop: 20,
                  fontSize: 48,
                  lineHeight: 1.2,
                }}
              >
                {product.name}
              </h1>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 15,
                  marginBottom: 25,
                }}
              >
                <Rate allowHalf disabled value={product.rating || 0} />

                <span
                  style={{
                    fontSize: 18,
                    color: "#626263ff",
                  }}
                >
                  {(product.rating || 0).toFixed(1)} / 5 -{" "}
                  {product.numReviews || 0} đánh giá
                </span>
              </div>

              <div
                style={{
                  color: "#ef4444",
                  fontSize: 42,
                  fontWeight: 700,
                  marginBottom: 30,
                }}
              >
                {product.price?.toLocaleString("vi-VN")}đ
              </div>

              <p
                style={{
                  fontSize: 18,
                  color: "#4b5563",
                  lineHeight: 1.8,
                  marginBottom: 35,
                }}
              >
                {product.description}
              </p>

              <Divider />

              <div style={{ marginBottom: 35 }}>
                <h3 style={{ marginBottom: 15 }}>Chọn size</h3>

                <div
                  style={{
                    display: "flex",
                    gap: 15,
                    flexWrap: "wrap",
                  }}
                >
                  {product.sizes?.map((size) => (
                    <Button
                      key={size}
                      size="large"
                      type={selectedSize === size ? "primary" : "default"}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        width: 60,
                        height: 50,
                        borderRadius: 12,
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 35 }}>
                <h3 style={{ marginBottom: 15 }}>Màu sắc</h3>

                <div
                  style={{
                    display: "flex",
                    gap: 15,
                    flexWrap: "wrap",
                  }}
                >
                  {product.colors?.map((color) => (
                    <Button
                      key={color}
                      type={selectedColor === color ? "primary" : "default"}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        borderRadius: 20,
                      }}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 40 }}>
                <h3 style={{ marginBottom: 15 }}>Số lượng</h3>

                <InputNumber
                  min={1}
                  max={product.countInStock || 1}
                  value={quantity}
                  size="large"
                  onChange={(value) => setQuantity(value || 1)}
                />

                <p style={{ marginTop: 10, color: "#6b7280" }}>
                  Còn lại: {product.countInStock || 0} sản phẩm
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 20,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  disabled={product.countInStock <= 0}
                  style={{
                    height: 55,
                    padding: "0 40px",
                    borderRadius: 14,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Thêm vào giỏ
                </Button>

                <Button
                  size="large"
                  icon={<HeartOutlined />}
                  style={{
                    height: 55,
                    padding: "0 30px",
                    borderRadius: 14,
                    fontSize: 16,
                  }}
                >
                  Yêu thích
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        <Card
          style={{
            marginTop: 40,
            borderRadius: 25,
            border: "none",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
          bodyStyle={{
            padding: 35,
          }}
        >
          <h1 style={{ marginBottom: 30 }}>Đánh giá sản phẩm</h1>

          <Row gutter={[30, 30]}>
            <Col xs={24} lg={10}>
              <Card
                style={{
                  borderRadius: 20,
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h2 style={{ marginBottom: 20 }}>Viết đánh giá</h2>

                <Form layout="vertical">
                  <Form.Item label="Tên của bạn">
                    <Input
                      size="large"
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item label="Số sao">
                    <Rate value={reviewRating} onChange={setReviewRating} />
                  </Form.Item>

                  <Form.Item label="Nội dung đánh giá">
                    <TextArea
                      rows={5}
                      placeholder="Bạn cảm thấy sản phẩm như thế nào?"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    size="large"
                    block
                    loading={reviewLoading}
                    onClick={handleSubmitReview}
                    style={{
                      height: 48,
                      borderRadius: 12,
                      fontWeight: 600,
                    }}
                  >
                    Gửi đánh giá
                  </Button>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={14}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <h2 style={{ margin: 0 }}>
                  Bình luận ({product.reviews?.length || 0})
                </h2>

                <div>
                  <Rate allowHalf disabled value={product.rating || 0} />
                </div>
              </div>

              {product.reviews?.length > 0 ? (
                product.reviews
                  .slice()
                  .reverse()
                  .map((review) => (
                    <div
                      key={review._id}
                      style={{
                        padding: 20,
                        borderRadius: 15,
                        background: "#f9fafb",
                        marginBottom: 16,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <h3 style={{ margin: 0 }}>
                          {review.name || "Khách hàng"}
                        </h3>

                        <span style={{ color: "#6b7280", fontSize: 13 }}>
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString(
                                "vi-VN",
                              )
                            : ""}
                        </span>
                      </div>

                      <Rate
                        disabled
                        value={review.rating}
                        style={{ fontSize: 15, marginTop: 8 }}
                      />

                      <p
                        style={{
                          marginTop: 12,
                          marginBottom: 0,
                          fontSize: 16,
                          color: "#374151",
                          lineHeight: 1.7,
                        }}
                      >
                        {review.comment}
                      </p>
                    </div>
                  ))
              ) : (
                <Empty description="Chưa có đánh giá nào" />
              )}
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;
