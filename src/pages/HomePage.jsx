import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Button,
  Card,
  Col,
  Row,
  Typography,
  Tag,
  Rate,
  Spin,
  message,
} from "antd";

import {
  ShoppingCartOutlined,
  FireOutlined,
  ThunderboltOutlined,
  RobotOutlined,
  ArrowRightOutlined,
  SkinOutlined,
  CrownOutlined,
  GiftOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");

      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể tải sản phẩm trang chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const productImg =
      product.images?.[0] ||
      product.image ||
      "https://placehold.co/600x600?text=Fashion+AI";

    const existingIndex = cart.findIndex(
      (item) => item._id === product._id || item.id === product._id,
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        ...product,
        id: product._id,
        _id: product._id,
        image: productImg,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    message.success(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  const trendingProducts = products
    .filter((item) => item.rating >= 4.6)
    .slice(0, 4);

  const saleProducts = products.filter((item) => item.isSale).slice(0, 4);

  const categories = [
    {
      title: "Thời trang nam",
      desc: "Hoodie, jeans, sneaker và phụ kiện nam.",
      icon: <CrownOutlined />,
      link: "/products?gender=men",
      bg: "linear-gradient(135deg, #111827, #2563eb)",
    },
    {
      title: "Thời trang nữ",
      desc: "Đầm, áo kiểu, túi xách và outfit hiện đại.",
      icon: <SkinOutlined />,
      link: "/products?gender=women",
      bg: "linear-gradient(135deg, #be185d, #f472b6)",
    },
    {
      title: "Sale cực hot",
      desc: "Ưu đãi giới hạn cho các sản phẩm nổi bật.",
      icon: <GiftOutlined />,
      link: "/products?sale=true",
      bg: "linear-gradient(135deg, #dc2626, #f97316)",
    },
  ];

  const renderProductCard = (product) => {
    const imageUrl =
      product.images?.[0] ||
      product.image ||
      "https://placehold.co/600x600?text=Fashion+AI";

    return (
      <Card
        hoverable
        key={product._id}
        style={{
          borderRadius: 24,
          overflow: "hidden",
          border: "none",
          height: "100%",
          boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
        }}
        cover={
          <div
            onClick={() => navigate(`/product/${product._id}`)}
            style={{
              height: 320,
              overflow: "hidden",
              cursor: "pointer",
              background: "#f3f4f6",
            }}
          >
            <img
              src={imageUrl}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/600x600?text=Fashion+AI";
              }}
            />
          </div>
        }
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <Tag color="blue">{product.category}</Tag>

          {product.isSale && <Tag color="red">-{product.discount || 0}%</Tag>}
        </div>

        <Title
          level={4}
          onClick={() => navigate(`/product/${product._id}`)}
          style={{
            margin: 0,
            marginBottom: 10,
            cursor: "pointer",
            minHeight: 54,
          }}
        >
          {product.name}
        </Title>

        <Rate
          disabled
          allowHalf
          value={product.rating || 0}
          style={{ fontSize: 14, marginBottom: 12 }}
        />

        <div
          style={{
            color: "#ef4444",
            fontSize: 24,
            fontWeight: 800,
            marginBottom: 16,
          }}
        >
          {(product.price || 0).toLocaleString("vi-VN")}đ
        </div>

        <Button
          type="primary"
          block
          size="large"
          icon={<ShoppingCartOutlined />}
          onClick={() => handleAddToCart(product)}
          style={{
            height: 46,
            borderRadius: 14,
            fontWeight: 700,
          }}
        >
          Thêm vào giỏ
        </Button>
      </Card>
    );
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* HERO */}
      <section
        style={{
          minHeight: 650,
          background:
            "radial-gradient(circle at top left, #dbeafe 0, transparent 35%), linear-gradient(135deg, #020617 0%, #111827 45%, #1e3a8a 100%)",
          color: "#fff",
          padding: "80px 24px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <Tag
                color="blue"
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  marginBottom: 24,
                  fontWeight: 700,
                }}
              >
                <ThunderboltOutlined /> Fashion AI Collection 2026
              </Tag>

              <Title
                style={{
                  color: "#fff",
                  fontSize: "clamp(46px, 6vw, 86px)",
                  lineHeight: 1.02,
                  marginBottom: 24,
                  fontWeight: 900,
                }}
              >
                Mặc đẹp hơn với gợi ý từ AI
              </Title>

              <Paragraph
                style={{
                  color: "#cbd5e1",
                  fontSize: 20,
                  lineHeight: 1.8,
                  maxWidth: 620,
                }}
              >
                Khám phá sản phẩm thời trang hiện đại, lọc theo nam, nữ, sale và
                tìm kiếm outfit phù hợp chỉ trong vài giây.
              </Paragraph>

              <div
                style={{
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                  marginTop: 34,
                }}
              >
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate("/products")}
                  style={{
                    height: 56,
                    padding: "0 34px",
                    borderRadius: 16,
                    fontWeight: 800,
                  }}
                >
                  Mua sắm ngay <ArrowRightOutlined />
                </Button>

                <Button
                  size="large"
                  ghost
                  icon={<RobotOutlined />}
                  onClick={() => navigate("/products?search=hoodie")}
                  style={{
                    height: 56,
                    padding: "0 34px",
                    borderRadius: 16,
                    fontWeight: 800,
                  }}
                >
                  Gợi ý outfit AI
                </Button>
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <div
                style={{
                  position: "relative",
                  minHeight: 520,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
                  alt="Fashion AI"
                  style={{
                    width: "75%",
                    height: 520,
                    objectFit: "cover",
                    borderRadius: 40,
                    boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
                  }}
                />

                <Card
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 40,
                    width: 280,
                    borderRadius: 26,
                    border: "none",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                  }}
                >
                  <FireOutlined style={{ color: "#ef4444", fontSize: 28 }} />
                  <Title level={4} style={{ marginTop: 12 }}>
                    Trending Sale
                  </Title>
                  <Text type="secondary">
                    Nhiều sản phẩm đang giảm giá đến 30%.
                  </Text>

                  <Button
                    type="primary"
                    block
                    onClick={() => navigate("/products?sale=true")}
                    style={{
                      marginTop: 18,
                      borderRadius: 12,
                      height: 42,
                    }}
                  >
                    Xem sale
                  </Button>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "70px 24px" }}>
        {/* FEATURES */}
        <Row gutter={[24, 24]} style={{ marginTop: -120, marginBottom: 70 }}>
          {[
            ["Miễn phí vận chuyển", "Cho đơn hàng từ 500.000đ"],
            ["Đổi trả dễ dàng", "Hỗ trợ đổi size trong 7 ngày"],
            ["Stylist AI", "Gợi ý sản phẩm theo xu hướng"],
          ].map((item) => (
            <Col xs={24} md={8} key={item[0]}>
              <Card
                style={{
                  borderRadius: 24,
                  border: "none",
                  boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
                }}
              >
                <Title level={4} style={{ marginBottom: 8 }}>
                  {item[0]}
                </Title>
                <Text type="secondary">{item[1]}</Text>
              </Card>
            </Col>
          ))}
        </Row>

        {/* CATEGORIES */}
        <div style={{ marginBottom: 70 }}>
          <Title level={2}>Khám phá nhanh</Title>

          <Row gutter={[24, 24]}>
            {categories.map((item) => (
              <Col xs={24} md={8} key={item.title}>
                <Card
                  hoverable
                  onClick={() => navigate(item.link)}
                  style={{
                    minHeight: 230,
                    borderRadius: 28,
                    border: "none",
                    background: item.bg,
                    color: "#fff",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 42, marginBottom: 24 }}>
                    {item.icon}
                  </div>

                  <Title level={3} style={{ color: "#fff" }}>
                    {item.title}
                  </Title>

                  <Paragraph style={{ color: "rgba(255,255,255,0.8)" }}>
                    {item.desc}
                  </Paragraph>

                  <Text style={{ color: "#fff", fontWeight: 700 }}>
                    Xem ngay <ArrowRightOutlined />
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* TRENDING */}
        <div style={{ marginBottom: 70 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              marginBottom: 24,
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div>
              <Tag color="red">
                <FireOutlined /> Trending
              </Tag>
              <Title level={2} style={{ marginTop: 12 }}>
                Sản phẩm nổi bật
              </Title>
            </div>

            <Link to="/products">
              <Button type="primary" size="large" style={{ borderRadius: 14 }}>
                Xem tất cả <ArrowRightOutlined />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {(trendingProducts.length
                ? trendingProducts
                : products.slice(0, 4)
              ).map((product) => (
                <Col xs={24} sm={12} lg={6} key={product._id}>
                  {renderProductCard(product)}
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* SALE */}
        <div style={{ marginBottom: 70 }}>
          <Card
            style={{
              borderRadius: 34,
              border: "none",
              background:
                "linear-gradient(135deg, #fff7ed 0%, #fee2e2 45%, #eff6ff 100%)",
              overflow: "hidden",
            }}
            bodyStyle={{ padding: 40 }}
          >
            <Row gutter={[30, 30]} align="middle">
              <Col xs={24} lg={8}>
                <Tag color="red">HOT DEAL</Tag>

                <Title level={2} style={{ marginTop: 16 }}>
                  Sale đang diễn ra
                </Title>

                <Paragraph style={{ fontSize: 16, color: "#64748b" }}>
                  Các sản phẩm giảm giá được lấy trực tiếp từ MongoDB với
                  `isSale: true`.
                </Paragraph>

                <Button
                  type="primary"
                  danger
                  size="large"
                  onClick={() => navigate("/products?sale=true")}
                  style={{ borderRadius: 14 }}
                >
                  Xem toàn bộ sale
                </Button>
              </Col>

              <Col xs={24} lg={16}>
                <Row gutter={[20, 20]}>
                  {(saleProducts.length
                    ? saleProducts
                    : products.slice(0, 4)
                  ).map((product) => (
                    <Col xs={24} sm={12} key={product._id}>
                      <Card
                        hoverable
                        onClick={() => navigate(`/product/${product._id}`)}
                        style={{
                          borderRadius: 22,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", gap: 16 }}>
                          <img
                            src={
                              product.images?.[0] ||
                              "https://placehold.co/300x300?text=Sale"
                            }
                            alt={product.name}
                            style={{
                              width: 110,
                              height: 110,
                              borderRadius: 18,
                              objectFit: "cover",
                            }}
                          />

                          <div>
                            <Tag color="red">-{product.discount || 0}%</Tag>
                            <Title level={5} style={{ marginTop: 8 }}>
                              {product.name}
                            </Title>
                            <Text strong style={{ color: "#ef4444" }}>
                              {(product.price || 0).toLocaleString("vi-VN")}đ
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Card>
        </div>

        {/* AI CTA */}
        <section
          style={{
            borderRadius: 36,
            padding: "70px 30px",
            textAlign: "center",
            background: "linear-gradient(135deg, #111827, #1d4ed8)",
            color: "#fff",
          }}
        >
          <RobotOutlined style={{ fontSize: 56, color: "#93c5fd" }} />

          <Title
            level={2}
            style={{
              color: "#fff",
              marginTop: 20,
              fontSize: 42,
            }}
          >
            Tìm outfit bằng AI
          </Title>

          <Paragraph
            style={{
              color: "#dbeafe",
              fontSize: 18,
              maxWidth: 720,
              margin: "0 auto 28px",
            }}
          >
            Bắt đầu bằng các từ khóa như hoodie, sneaker, blazer, jeans để tìm
            sản phẩm phù hợp nhanh hơn.
          </Paragraph>

          <Button
            size="large"
            onClick={() => navigate("/products?search=sneaker")}
            style={{
              height: 54,
              padding: "0 34px",
              borderRadius: 16,
              fontWeight: 800,
            }}
          >
            Thử tìm Sneaker
          </Button>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
