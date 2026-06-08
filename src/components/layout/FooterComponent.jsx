import { Layout, Row, Col, Input, Button } from "antd";

import {
  FacebookFilled,
  InstagramOutlined,
  TikTokOutlined,
  YoutubeFilled,
  SendOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;

const FooterComponent = () => {
  return (
    <Footer
      style={{
        background: "#0f172a",
        color: "#fff",
        padding: "70px 40px 30px",
        marginTop: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <Row gutter={[50, 50]}>
          {/* BRAND */}
          <Col xs={24} sm={24} md={12} lg={8}>
            <h1
              style={{
                color: "#fff",
                fontSize: 38,
                fontWeight: 800,
                marginBottom: 20,
              }}
            >
              Fashion AI
            </h1>

            <p
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                fontSize: 16,
                maxWidth: 420,
              }}
            >
              Website thời trang tích hợp AI giúp khách hàng tìm kiếm, mua sắm
              và nhận tư vấn thời trang thông minh.
            </p>

            {/* SOCIAL */}
            <div
              style={{
                display: "flex",
                gap: 14,
                marginTop: 30,
                flexWrap: "wrap",
              }}
            >
              {[
                FacebookFilled,
                InstagramOutlined,
                TikTokOutlined,
                YoutubeFilled,
              ].map((Icon, index) => (
                <div
                  key={index}
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: "50%",
                    background: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Icon
                    style={{
                      fontSize: 20,
                      color: "#fff",
                    }}
                  />
                </div>
              ))}
            </div>
          </Col>

          {/* MENU */}
          <Col xs={12} sm={12} md={6} lg={4}>
            <h3
              style={{
                color: "#fff",
                marginBottom: 25,
                fontSize: 20,
              }}
            >
              Danh mục
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <span style={{ color: "#cbd5e1" }}>Thời trang nam</span>
              <span style={{ color: "#cbd5e1" }}>Thời trang nữ</span>
              <span style={{ color: "#cbd5e1" }}>Sneaker</span>
              <span style={{ color: "#cbd5e1" }}>Sale</span>
            </div>
          </Col>

          {/* SUPPORT */}
          <Col xs={12} sm={12} md={6} lg={4}>
            <h3
              style={{
                color: "#fff",
                marginBottom: 25,
                fontSize: 20,
              }}
            >
              Hỗ trợ
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <span style={{ color: "#cbd5e1" }}>Liên hệ</span>
              <span style={{ color: "#cbd5e1" }}>Chính sách</span>
              <span style={{ color: "#cbd5e1" }}>Vận chuyển</span>
              <span style={{ color: "#cbd5e1" }}>Bảo mật</span>
            </div>
          </Col>

          {/* NEWSLETTER */}
          <Col xs={24} sm={24} md={24} lg={8}>
            <h3
              style={{
                color: "#fff",
                marginBottom: 20,
                fontSize: 20,
              }}
            >
              Đăng ký nhận tin
            </h3>

            <p
              style={{
                color: "#cbd5e1",
                marginBottom: 25,
                lineHeight: 1.7,
              }}
            >
              Nhận thông tin về sản phẩm mới và khuyến mãi mới nhất.
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Input
                placeholder="Nhập email..."
                style={{
                  flex: 1,
                  minWidth: 220,
                  height: 48,
                  borderRadius: 12,
                  border: "none",
                }}
              />

              <Button
                type="primary"
                icon={<SendOutlined />}
                style={{
                  height: 48,
                  borderRadius: 12,
                  paddingInline: 24,
                  fontWeight: 600,
                }}
              >
                Gửi
              </Button>
            </div>
          </Col>
        </Row>

        {/* COPYRIGHT */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            marginTop: 60,
            paddingTop: 25,
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 15,
          }}
        >
          © 2026 Fashion AI. All rights reserved.
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
