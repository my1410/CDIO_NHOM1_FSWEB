import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  InputNumber,
  Divider,
  message,
  Empty,
} from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // LẤY DỮ LIỆU TỪ LOCAL STORAGE KHI VÀO TRANG
  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(savedCart);
    };

    loadCart();

    // Lắng nghe sự kiện để tự động cập nhật nếu mở nhiều tab
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  // HÀM TÍNH TỔNG TIỀN
  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );

  // HÀM THAY ĐỔI SỐ LƯỢNG
  const handleQuantityChange = (id, value) => {
    const updatedCart = cartItems.map((item) => {
      if (item._id === id || item.id === id) {
        return { ...item, quantity: value };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // HÀM XÓA SẢN PHẨM KHỎI GIỎ
  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter(
      (item) => item._id !== id && item.id !== id,
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    message.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div
      style={{
        background: "#f8fafc",
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
        {/* TITLE */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 800,
              marginBottom: 10,
              color: "#111827", // Ép màu đậm
            }}
          >
            Giỏ hàng
          </h1>
          <p style={{ color: "#6b7280", fontSize: 16 }}>
            Có <strong>{cartItems.length}</strong> sản phẩm trong giỏ hàng
          </p>
        </div>

        {cartItems.length === 0 ? (
          <Empty
            description="Giỏ hàng của bạn đang trống"
            style={{
              marginTop: 50,
              padding: 50,
              background: "#fff",
              borderRadius: 20,
            }}
          />
        ) : (
          <Row gutter={[30, 30]}>
            {/* LEFT - DANH SÁCH SẢN PHẨM */}
            <Col xs={24} lg={16}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 25 }}
              >
                {cartItems.map((item) => (
                  <Card
                    key={item._id || item.id}
                    style={{
                      borderRadius: 24,
                      border: "none",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    }}
                    styles={{ body: { padding: 25 } }}
                  >
                    <Row gutter={[20, 20]} align="middle">
                      {/* IMAGE */}
                      <Col xs={24} sm={6}>
                        <img
                          src={
                            item.image ||
                            "https://placehold.co/600x600?text=Fashion+AI"
                          }
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: 180,
                            objectFit: "cover",
                            borderRadius: 18,
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/600x600?text=Fashion+AI";
                          }}
                        />
                      </Col>

                      {/* INFO */}
                      <Col xs={24} sm={10}>
                        <h2
                          style={{
                            fontSize: 22,
                            fontWeight: 700,
                            marginBottom: 12,
                            color: "#111827", // FIX LỖI MỜ CHỮ: Ép màu đen đậm
                          }}
                        >
                          {item.name}
                        </h2>
                        <p
                          style={{
                            color: "#2563eb",
                            fontSize: 24,
                            fontWeight: 700,
                            margin: 0,
                          }}
                        >
                          {(item.price || 0).toLocaleString("vi-VN")}đ
                        </p>
                      </Col>

                      {/* ACTION */}
                      <Col xs={24} sm={8}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 20,
                            alignItems: "flex-end",
                          }}
                        >
                          <InputNumber
                            min={1}
                            max={item.countInStock || 99}
                            value={item.quantity}
                            size="large"
                            onChange={(value) =>
                              handleQuantityChange(item._id || item.id, value)
                            }
                          />
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                              handleRemoveItem(item._id || item.id)
                            }
                          >
                            Xóa
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            </Col>

            {/* RIGHT - TỔNG KẾT THANH TOÁN */}
            <Col xs={24} lg={8}>
              <Card
                style={{
                  borderRadius: 24,
                  border: "none",
                  position: "sticky",
                  top: 110,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                }}
                styles={{ body: { padding: 30 } }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 30,
                  }}
                >
                  <ShoppingCartOutlined
                    style={{ fontSize: 28, color: "#2563eb" }}
                  />
                  <h2
                    style={{
                      fontSize: 24,
                      margin: 0,
                      color: "#111827",
                      fontWeight: 700,
                    }}
                  >
                    Thanh toán
                  </h2>
                </div>

                <Divider />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 20,
                    fontSize: 17,
                    color: "#374151",
                  }}
                >
                  <span>Tạm tính</span>
                  <strong>{total.toLocaleString("vi-VN")}đ</strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 30,
                    fontSize: 17,
                    color: "#374151",
                  }}
                >
                  <span>Phí vận chuyển</span>
                  <strong>30.000đ</strong>
                </div>

                <Divider />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 35,
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  <span style={{ color: "#111827" }}>Tổng cộng</span>
                  <span style={{ color: "#ef4444" }}>
                    {(total + 30000).toLocaleString("vi-VN")}đ
                  </span>
                </div>

                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={() => navigate("/checkout")}
                  style={{
                    height: 55,
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: 17,
                    background: "#2563eb",
                  }}
                >
                  Tiến hành thanh toán
                </Button>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default CartPage;
