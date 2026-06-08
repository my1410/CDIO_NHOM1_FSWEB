import { useState } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Divider,
  Checkbox,
  message,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  // 1. Khởi tạo các State để quản lý dữ liệu người dùng nhập vào và hiệu ứng Loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 2. Hàm xử lý logic khi người dùng nhấn nút "Đăng nhập"
  const handleLogin = async () => {
    // Kiểm tra nhanh tính hợp lệ trước khi gửi request
    if (!email || !password) {
      return message.warning("Vui lòng nhập đầy đủ Email và Mật khẩu!");
    }

    setLoading(true);
    try {
      // Gọi chính xác API đăng nhập của Backend đã hoàn thiện ở bước trước
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      // Nếu Backend xác thực tài khoản thành công
      if (response.data.token) {
        message.success("Đăng nhập thành công! Chào mừng quay trở lại 🎉");

        // 🌟 ĐIỂM QUAN TRỌNG: Lưu token vào localStorage để Chatbot và các API khác lấy ra dùng ngầm
        localStorage.setItem("token", response.data.token);

        // Điều hướng người dùng quay trở lại Trang chủ sau khi đăng nhập thành công
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      // Bóc tách câu báo lỗi từ Backend trả về (Ví dụ: "Mật khẩu không đúng", "Email không tồn tại")
      const errorMsg =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại!";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 1200,
          borderRadius: 30,
          overflow: "hidden",
          border: "none",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        }}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <Row>
          {/* LEFT - Hình ảnh nền giới thiệu thương hiệu */}
          <Col
            xs={0}
            md={12}
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1523381210434-271e8be1f52b)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              minHeight: 700,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(15,23,42,0.65)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: 60,
                color: "#fff",
              }}
            >
              <h1
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  marginBottom: 20,
                  color: "#fff",
                }}
              >
                Fashion AI
              </h1>
              <p
                style={{
                  fontSize: 22,
                  lineHeight: 1.7,
                  color: "#e2e8f0",
                }}
              >
                Khám phá phong cách thời trang hiện đại cùng AI.
              </p>
            </div>
          </Col>

          {/* RIGHT - Biểu mẫu nhập liệu */}
          <Col xs={24} md={12}>
            <div style={{ padding: "70px 60px" }}>
              <h1
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  marginBottom: 10,
                  color: "#111827",
                }}
              >
                Đăng nhập
              </h1>
              <p style={{ color: "#6b7280", marginBottom: 40, fontSize: 16 }}>
                Chào mừng bạn quay trở lại Fashion AI
              </p>

              {/* EMAIL INPUT */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ marginBottom: 10, fontWeight: 600 }}>Email</p>
                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  placeholder="Nhập email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Lắng nghe sự thay đổi chữ
                  disabled={loading}
                  style={{ height: 52, borderRadius: 14 }}
                />
              </div>

              {/* PASSWORD INPUT */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ marginBottom: 10, fontWeight: 600 }}>Mật khẩu</p>
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Lắng nghe sự thay đổi chữ
                  onPressEnter={handleLogin} // Nhấn Enter ở ô mật khẩu cũng tự kích hoạt đăng nhập
                  disabled={loading}
                  style={{ height: 52, borderRadius: 14 }}
                />
              </div>

              {/* OPTIONS */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 30,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <Checkbox disabled={loading}>Ghi nhớ đăng nhập</Checkbox>
                <a href="#" style={{ color: "#2563eb", fontWeight: 500 }}>
                  Quên mật khẩu?
                </a>
              </div>

              {/* LOGIN BUTTON */}
              <Button
                type="primary"
                block
                size="large"
                onClick={handleLogin} // Ráp hàm xử lý sự kiện kích hoạt API
                loading={loading} // Tự hiển thị vòng xoay loading chặn người dùng bấm liên tục
                style={{
                  height: 55,
                  borderRadius: 14,
                  fontSize: 17,
                  fontWeight: 700,
                  marginBottom: 25,
                }}
              >
                Đăng nhập
              </Button>

              <Divider>Hoặc</Divider>

              {/* SOCIAL BUTTONS */}
              <div style={{ display: "flex", gap: 15, marginBottom: 35 }}>
                <Button
                  icon={<GoogleOutlined />}
                  size="large"
                  disabled={loading}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 14,
                    fontWeight: 600,
                  }}
                >
                  Google
                </Button>
                <Button
                  icon={<FacebookFilled />}
                  size="large"
                  disabled={loading}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 14,
                    fontWeight: 600,
                  }}
                >
                  Facebook
                </Button>
              </div>

              {/* REGISTER LINK */}
              <div
                style={{ textAlign: "center", fontSize: 16, color: "#6b7280" }}
              >
                Bạn chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#2563eb",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default LoginPage;
