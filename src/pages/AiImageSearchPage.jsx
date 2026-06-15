import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Card,
  Upload,
  Button,
  Row,
  Col,
  Typography,
  message,
  Tag,
  Empty,
  Spin,
  Rate,
} from "antd";

import {
  InboxOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  CameraOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;
const { Title, Text, Paragraph } = Typography;

const AiImageSearchPage = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [products, setProducts] = useState([]);

  const handleSelectFile = (selectedFile) => {
    if (!selectedFile) {
      message.error("Không lấy được file ảnh");
      return Upload.LIST_IGNORE;
    }

    if (!selectedFile.type?.startsWith("image/")) {
      message.error("Vui lòng chọn file hình ảnh");
      return Upload.LIST_IGNORE;
    }

    setFile(selectedFile);

    const preview = URL.createObjectURL(selectedFile);
    setPreviewUrl(preview);

    setAiAnalysis(null);
    setProducts([]);

    return false;
  };

  const handleSearchByImage = async () => {
    if (!file) {
      message.warning("Vui lòng chọn hình ảnh trước");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        "http://localhost:5000/api/ai/image-search",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        setAiAnalysis(res.data.aiAnalysis);
        setProducts(res.data.products || []);

        message.success("AI đã phân tích hình ảnh thành công");
      } else {
        message.error(res.data.message || "Không thể phân tích hình ảnh");
      }
    } catch (error) {
      console.log(error);
      message.error(
        error.response?.data?.message || "Không thể tìm kiếm bằng hình ảnh",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

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
      size: product.sizes?.[0] || "",
      color: product.colors?.[0] || "",
      quantity: 1,
    };

    const existingIndex = cart.findIndex(
      (item) =>
        item.productId === cartItem.productId &&
        item.size === cartItem.size &&
        item.color === cartItem.color,
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    message.success("Đã thêm vào giỏ hàng");
  };

  const renderAnalysis = () => {
    if (!aiAnalysis) return null;

    return (
      <Card
        bordered={false}
        style={{
          borderRadius: 24,
          marginTop: 24,
          background: "#f8fafc",
        }}
      >
        <Title level={4} style={{ color: "#111827", marginBottom: 16 }}>
          Kết quả AI phân tích
        </Title>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {aiAnalysis.category && (
            <Tag color="blue">Danh mục: {aiAnalysis.category}</Tag>
          )}

          {aiAnalysis.gender && (
            <Tag color="purple">Giới tính: {aiAnalysis.gender}</Tag>
          )}

          {aiAnalysis.style && (
            <Tag color="green">Phong cách: {aiAnalysis.style}</Tag>
          )}

          {aiAnalysis.colors?.map((color) => (
            <Tag color="orange" key={color}>
              Màu: {color}
            </Tag>
          ))}

          {aiAnalysis.keywords?.map((keyword) => (
            <Tag key={keyword}>#{keyword}</Tag>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "50px 20px",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Card
          bordered={false}
          style={{
            borderRadius: 32,
            marginBottom: 36,
            background:
              "linear-gradient(135deg, #111827 0%, #1d4ed8 55%, #60a5fa 100%)",
            overflow: "hidden",
          }}
          bodyStyle={{ padding: 44 }}
        >
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={15}>
              <Tag
                color="blue"
                style={{
                  borderRadius: 999,
                  padding: "8px 16px",
                  fontWeight: 700,
                  marginBottom: 18,
                }}
              >
                <CameraOutlined /> AI IMAGE SEARCH
              </Tag>

              <Title
                style={{
                  color: "#fff",
                  fontSize: 48,
                  fontWeight: 900,
                  marginBottom: 16,
                }}
              >
                Tìm sản phẩm bằng hình ảnh
              </Title>

              <Paragraph
                style={{
                  color: "#dbeafe",
                  fontSize: 18,
                  lineHeight: 1.8,
                  maxWidth: 720,
                }}
              >
                Tải lên ảnh quần áo, giày hoặc phụ kiện. AI sẽ phân tích màu
                sắc, danh mục, phong cách và tìm sản phẩm tương tự trong Fashion
                AI Store.
              </Paragraph>
            </Col>

            <Col xs={24} lg={9}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 24,
                  background: "rgba(255,255,255,0.95)",
                }}
              >
                <Text strong style={{ color: "#111827", fontSize: 16 }}>
                  AI có thể nhận diện:
                </Text>

                <div style={{ marginTop: 16 }}>
                  <Tag color="blue">Áo</Tag>
                  <Tag color="green">Quần</Tag>
                  <Tag color="purple">Giày</Tag>
                  <Tag color="orange">Phụ kiện</Tag>
                  <Tag color="red">Màu sắc</Tag>
                  <Tag>Phong cách</Tag>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>

        <Row gutter={[30, 30]}>
          <Col xs={24} lg={9}>
            <Card
              bordered={false}
              style={{
                borderRadius: 28,
                boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
              }}
              bodyStyle={{ padding: 28 }}
            >
              <Title level={3} style={{ color: "#111827" }}>
                Tải ảnh lên
              </Title>

              <Text type="secondary">
                Chọn ảnh sản phẩm thời trang từ máy của bạn.
              </Text>

              <div style={{ marginTop: 24 }}>
                <Dragger
                  name="image"
                  maxCount={1}
                  beforeUpload={handleSelectFile}
                  showUploadList={false}
                  accept="image/*"
                  style={{
                    borderRadius: 20,
                    background: "#f8fafc",
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ color: "#2563eb" }} />
                  </p>

                  <p className="ant-upload-text">
                    Bấm hoặc kéo thả hình ảnh vào đây
                  </p>

                  <p className="ant-upload-hint">
                    Hỗ trợ JPG, PNG, WEBP. Dung lượng nên dưới 5MB.
                  </p>
                </Dragger>
              </div>

              {previewUrl && (
                <div style={{ marginTop: 24 }}>
                  <Text strong>Ảnh đã chọn</Text>

                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: 320,
                      objectFit: "cover",
                      borderRadius: 20,
                      marginTop: 12,
                      display: "block",
                    }}
                  />
                </div>
              )}

              <Button
                type="primary"
                size="large"
                block
                icon={<SearchOutlined />}
                loading={loading}
                onClick={handleSearchByImage}
                style={{
                  height: 52,
                  borderRadius: 16,
                  fontWeight: 800,
                  marginTop: 24,
                }}
              >
                AI tìm sản phẩm
              </Button>

              {renderAnalysis()}
            </Card>
          </Col>

          <Col xs={24} lg={15}>
            <Card
              bordered={false}
              style={{
                borderRadius: 28,
                boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
              }}
              bodyStyle={{ padding: 28 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "end",
                  marginBottom: 24,
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <Title level={3} style={{ color: "#111827", margin: 0 }}>
                    Sản phẩm phù hợp
                  </Title>

                  <Text type="secondary">
                    AI tìm thấy {products.length} sản phẩm tương tự.
                  </Text>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: 80 }}>
                  <Spin size="large" />
                </div>
              ) : products.length > 0 ? (
                <Row gutter={[22, 22]}>
                  {products.map((product) => {
                    const imageUrl =
                      product.images?.[0] ||
                      product.image ||
                      "https://placehold.co/600x600?text=Fashion+AI";

                    return (
                      <Col xs={24} sm={12} xl={8} key={product._id}>
                        <Card
                          hoverable
                          style={{
                            borderRadius: 22,
                            overflow: "hidden",
                            height: "100%",
                            border: "1px solid #e5e7eb",
                          }}
                          cover={
                            <div
                              onClick={() =>
                                navigate(`/product/${product._id}`)
                              }
                              style={{
                                height: 260,
                                overflow: "hidden",
                                cursor: "pointer",
                              }}
                            >
                              <img
                                src={imageUrl}
                                alt={product.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://placehold.co/600x600?text=Fashion+AI";
                                }}
                              />
                            </div>
                          }
                        >
                          <div style={{ marginBottom: 10 }}>
                            <Tag color="blue">{product.category}</Tag>

                            {product.matchScore > 0 && (
                              <Tag color="green">
                                Match {product.matchScore}
                              </Tag>
                            )}

                            {product.isSale && (
                              <Tag color="red">-{product.discount || 0}%</Tag>
                            )}
                          </div>

                          <Title
                            level={5}
                            onClick={() => navigate(`/product/${product._id}`)}
                            style={{
                              color: "#111827",
                              cursor: "pointer",
                              minHeight: 48,
                              marginBottom: 8,
                            }}
                          >
                            {product.name}
                          </Title>

                          <Rate
                            disabled
                            allowHalf
                            value={product.rating || 0}
                            style={{ fontSize: 14, marginBottom: 10 }}
                          />

                          <div
                            style={{
                              color: "#ef4444",
                              fontSize: 22,
                              fontWeight: 900,
                              marginBottom: 14,
                            }}
                          >
                            {(product.price || 0).toLocaleString("vi-VN")}đ
                          </div>

                          <Button
                            type="primary"
                            block
                            icon={<ShoppingCartOutlined />}
                            onClick={() => handleAddToCart(product)}
                            style={{
                              height: 44,
                              borderRadius: 12,
                              fontWeight: 700,
                            }}
                          >
                            Thêm vào giỏ
                          </Button>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <Empty description="Chưa có kết quả. Hãy tải ảnh lên để AI tìm sản phẩm." />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AiImageSearchPage;
