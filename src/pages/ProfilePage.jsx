import { useEffect, useState } from "react";
import { Card, Form, Input, Button, Avatar, message, Row, Col } from "antd";
import { UserOutlined, SaveOutlined } from "@ant-design/icons";
import axios from "axios";

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("userInfo"));

    if (savedUser) {
      setUserInfo(savedUser);

      form.setFieldsValue({
        name: savedUser.user?.name,
        email: savedUser.user?.email,
        phone: savedUser.user?.phone || "",
        address: savedUser.user?.address || "",
      });
    }
  }, [form]);

  const handleUpdate = async (values) => {
    try {
      setLoading(true);

      const token = userInfo?.token;

      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        {
          name: values.name,
          phone: values.phone,
          address: values.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newUserInfo = {
        token,
        user: res.data.user,
      };

      localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
      window.dispatchEvent(new Event("userUpdated"));

      message.success("Cập nhật tài khoản thành công");
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Không thể cập nhật");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: 40 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Card
          bordered={false}
          style={{
            borderRadius: 28,
            boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
          }}
          bodyStyle={{ padding: 36 }}
        >
          <Row gutter={[36, 36]}>
            <Col xs={24} md={8}>
              <div
                style={{
                  textAlign: "center",
                  padding: 30,
                  borderRadius: 24,
                  background: "linear-gradient(135deg, #111827, #2563eb)",
                  color: "#fff",
                }}
              >
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  style={{
                    background: "#fff",
                    color: "#2563eb",
                    marginBottom: 20,
                  }}
                />

                <h2 style={{ color: "#fff", marginBottom: 8 }}>
                  {userInfo?.user?.name || "Người dùng"}
                </h2>

                <p style={{ color: "#dbeafe", margin: 0 }}>
                  {userInfo?.user?.email}
                </p>
              </div>
            </Col>

            <Col xs={24} md={16}>
              <h1
                style={{
                  margin: 0,
                  color: "#111827",
                  fontSize: 36,
                  fontWeight: 900,
                }}
              >
                Tài khoản của tôi
              </h1>

              <p style={{ color: "#6b7280", marginBottom: 30 }}>
                Quản lý thông tin cá nhân và địa chỉ giao hàng.
              </p>

              <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                  label="Họ tên"
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                >
                  <Input size="large" />
                </Form.Item>

                <Form.Item label="Email" name="email">
                  <Input size="large" disabled />
                </Form.Item>

                <Form.Item label="Số điện thoại" name="phone">
                  <Input size="large" placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item label="Địa chỉ" name="address">
                  <Input.TextArea rows={4} placeholder="Nhập địa chỉ" />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  icon={<SaveOutlined />}
                  style={{
                    height: 50,
                    borderRadius: 14,
                    fontWeight: 700,
                  }}
                >
                  Cập nhật thông tin
                </Button>
              </Form>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
