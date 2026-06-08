import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, message } from "antd";
import axios from "axios";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const shippingFee = 30000;

  const total =
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0) +
    shippingFee;

  const handleOrder = async (values) => {
    try {
      setLoading(true);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;

      if (!token) {
        message.warning("Vui lòng đăng nhập để đặt hàng");
        navigate("/login");
        return;
      }

      const orderItems = cart.map((item) => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        size: item.size || "",
        color: item.color || "",
        product: item.productId || item._id || item.id,
      }));

      await axios.post(
        "http://localhost:5000/api/orders",
        {
          orderItems,
          shippingAddress: {
            address: values.address,
            phone: values.phone,
          },
          totalPrice: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      message.success("Đặt hàng thành công");
      navigate("/products");
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Không thể đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: 40 }}>
      <Card
        style={{
          maxWidth: 700,
          margin: "0 auto",
          borderRadius: 24,
          border: "none",
        }}
      >
        <h1 style={{ color: "#111827", fontWeight: 800 }}>Thanh toán</h1>

        <p>
          Tổng thanh toán:{" "}
          <b style={{ color: "#ef4444" }}>{total.toLocaleString("vi-VN")}đ</b>
        </p>

        <Form layout="vertical" onFinish={handleOrder}>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ giao hàng"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            Đặt hàng
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default CheckoutPage;
