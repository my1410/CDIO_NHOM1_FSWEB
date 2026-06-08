import { useState } from "react";
import { Row, Col, Card, Input, Button, Form, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Hàm xử lý khi người dùng bấm nút Đăng ký
  const onFinish = async (values) => {
    const { name, email, password, confirmPassword } = values;

    // Kiểm tra tính trùng khớp mật khẩu ở Frontend
    if (password !== confirmPassword) {
      return message.error("Mật khẩu nhập lại không trùng khớp!");
    }

    setLoading(true);
    try {
      // 🌟 SỬA TẠI ĐÂY: Đính kèm thêm confirmPassword vào body gửi lên Backend
      // để thỏa mãn điều kiện Validation bắt buộc trong User Schema của bạn.
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
          confirmPassword,
        },
      );

      if (response.data) {
        message.success("Đăng ký tài khoản thành công! Hãy đăng nhập nhé 🎉");
        navigate("/login");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      const errorMsg =
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
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
          {/* LEFT - Khối ảnh nghệ thuật gốc */}
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

          {/* RIGHT - Form nhập liệu giữ nguyên giao diện đẹp của bạn */}
          <Col xs={24} md={12}>
            <div style={{ padding: "60px 60px" }}>
              <h1
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  marginBottom: 10,
                  color: "#111827",
                }}
              >
                Đăng ký tài khoản
              </h1>
              <p style={{ color: "#6b7280", marginBottom: 30, fontSize: 16 }}>
                Tạo tài khoản để trải nghiệm trợ lý thời trang AI độc quyền
              </p>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={true}
              >
                {/* HỌ TÊN */}
                <Form.Item
                  label={<span style={{ fontWeight: 600 }}>Họ tên</span>}
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="Nhập họ tên..."
                    disabled={loading}
                    style={{ height: 52, borderRadius: 14 }}
                  />
                </Form.Item>

                {/* EMAIL */}
                <Form.Item
                  label={<span style={{ fontWeight: 600 }}>Email</span>}
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Định dạng email không hợp lệ!" },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="Nhập email..."
                    disabled={loading}
                    style={{ height: 52, borderRadius: 14 }}
                  />
                </Form.Item>

                {/* MẬT KHẨU */}
                <Form.Item
                  label={<span style={{ fontWeight: 600 }}>Mật khẩu</span>}
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="Nhập mật khẩu..."
                    disabled={loading}
                    style={{ height: 52, borderRadius: 14 }}
                  />
                </Form.Item>

                {/* XÁC NHẬN MẬT KHẨU */}
                <Form.Item
                  label={
                    <span style={{ fontWeight: 600 }}>Xác nhận mật khẩu</span>
                  }
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng xác nhận lại mật khẩu!",
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="Nhập lại mật khẩu..."
                    disabled={loading}
                    style={{ height: 52, borderRadius: 14 }}
                  />
                </Form.Item>

                {/* NÚT ĐĂNG KÝ */}
                <Form.Item style={{ marginTop: 30 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                    style={{
                      height: 55,
                      borderRadius: 14,
                      fontSize: 17,
                      fontWeight: 700,
                    }}
                  >
                    Đăng ký
                  </Button>
                </Form.Item>
              </Form>

              {/* CHUYỂN TRANG ĐĂNG NHẬP */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: "#6b7280",
                  marginTop: 20,
                }}
              >
                Bạn đã có tài khoản?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#2563eb",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default RegisterPage;
