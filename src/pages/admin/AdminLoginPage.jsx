import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, message } from "antd";
import axios from "axios";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: values.email,
        password: values.password,
      });

      const { token, user } = res.data;

      if (user.role !== "admin") {
        message.error("Tài khoản này không có quyền admin");
        return;
      }

      localStorage.setItem(
        "adminInfo",
        JSON.stringify({
          token,
          user,
        }),
      );

      message.success("Đăng nhập admin thành công");
      navigate("/admin");
    } catch (error) {
      message.error(error.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #111827, #2563eb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 420,
          borderRadius: 24,
          border: "none",
        }}
      >
        <h1 style={{ margin: 0, color: "#111827", fontWeight: 900 }}>
          Admin Login
        </h1>

        <p style={{ color: "#6b7280", marginBottom: 30 }}>
          Đăng nhập để quản lý Fashion AI Store
        </p>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input size="large" placeholder="admin@gmail.com" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            Đăng nhập Admin
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
