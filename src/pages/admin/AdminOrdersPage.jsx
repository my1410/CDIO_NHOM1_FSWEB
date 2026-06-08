import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Tag,
  message,
  Button,
  Space,
  Image,
  Drawer,
  Descriptions,
  Empty,
} from "antd";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const token = adminInfo?.token;

      if (!token) {
        message.warning("Vui lòng đăng nhập admin");
        setOrders([]);
        return;
      }

      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusTag = (status) => {
    const value = status || "pending";

    const colorMap = {
      pending: "orange",
      processing: "blue",
      shipping: "purple",
      delivered: "green",
      cancelled: "red",
    };

    const labelMap = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      shipping: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };

    return (
      <Tag color={colorMap[value] || "default"}>{labelMap[value] || value}</Tag>
    );
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      width: 220,
      fixed: "left",
      render: (id) => <b style={{ color: "#111827" }}>{id}</b>,
    },
    {
      title: "Khách hàng",
      dataIndex: "user",
      width: 180,
      render: (user) => user?.name || user?.email || "Khách hàng",
    },
    {
      title: "Email",
      dataIndex: "user",
      width: 220,
      render: (user) => user?.email || "N/A",
    },
    {
      title: "SĐT",
      dataIndex: "shippingAddress",
      width: 140,
      render: (shippingAddress) => shippingAddress?.phone || "",
    },
    {
      title: "Địa chỉ",
      dataIndex: "shippingAddress",
      width: 300,
      render: (shippingAddress) => shippingAddress?.address || "",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      width: 150,
      render: (price) => (
        <b style={{ color: "#ef4444" }}>
          {(price || 0).toLocaleString("vi-VN")}đ
        </b>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "isPaid",
      width: 140,
      render: (isPaid) =>
        isPaid ? (
          <Tag color="green">Đã thanh toán</Tag>
        ) : (
          <Tag color="gold">COD</Tag>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 180,
      render: (date) => (date ? new Date(date).toLocaleString("vi-VN") : ""),
    },
    {
      title: "Hành động",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedOrder(record);
            setOpenDrawer(true);
          }}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card
        bordered={false}
        style={{
          borderRadius: 24,
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        }}
        bodyStyle={{ padding: 28 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 24,
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: "#111827",
                fontSize: 32,
                fontWeight: 900,
              }}
            >
              Quản lý đơn hàng
            </h1>

            <p style={{ color: "#6b7280", marginTop: 8, marginBottom: 0 }}>
              Tổng số: <b>{orders.length}</b> đơn hàng
            </p>
          </div>

          <Button icon={<ReloadOutlined />} onClick={fetchOrders}>
            Làm mới
          </Button>
        </div>

        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={orders}
          scroll={{ x: 1800 }}
          pagination={{
            pageSize: 8,
          }}
          locale={{
            emptyText: <Empty description="Chưa có đơn hàng nào" />,
          }}
        />
      </Card>

      <Drawer
        title="Chi tiết đơn hàng"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        width={760}
      >
        {selectedOrder && (
          <>
            <Descriptions
              bordered
              column={1}
              size="middle"
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="Mã đơn">
                {selectedOrder._id}
              </Descriptions.Item>

              <Descriptions.Item label="Khách hàng">
                {selectedOrder.user?.name ||
                  selectedOrder.user?.email ||
                  "Khách hàng"}
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                {selectedOrder.user?.email || "N/A"}
              </Descriptions.Item>

              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.shippingAddress?.phone || "N/A"}
              </Descriptions.Item>

              <Descriptions.Item label="Địa chỉ">
                {selectedOrder.shippingAddress?.address || "N/A"}
              </Descriptions.Item>

              <Descriptions.Item label="Thanh toán">
                {selectedOrder.isPaid ? (
                  <Tag color="green">Đã thanh toán</Tag>
                ) : (
                  <Tag color="gold">Thanh toán khi nhận hàng</Tag>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                {getStatusTag(selectedOrder.status)}
              </Descriptions.Item>

              <Descriptions.Item label="Tổng tiền">
                <b style={{ color: "#ef4444", fontSize: 18 }}>
                  {(selectedOrder.totalPrice || 0).toLocaleString("vi-VN")}đ
                </b>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo">
                {selectedOrder.createdAt
                  ? new Date(selectedOrder.createdAt).toLocaleString("vi-VN")
                  : ""}
              </Descriptions.Item>
            </Descriptions>

            <h2 style={{ color: "#111827", fontWeight: 800 }}>
              Sản phẩm trong đơn
            </h2>

            {selectedOrder.orderItems?.length > 0 ? (
              <Space direction="vertical" style={{ width: "100%" }} size={16}>
                {selectedOrder.orderItems.map((item, index) => (
                  <Card key={index} bordered style={{ borderRadius: 16 }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <Image
                        src={item.image}
                        width={90}
                        height={90}
                        style={{
                          objectFit: "cover",
                          borderRadius: 12,
                        }}
                        fallback="https://placehold.co/300x300?text=Fashion+AI"
                      />

                      <div>
                        <h3 style={{ margin: 0, color: "#111827" }}>
                          {item.name}
                        </h3>

                        <p style={{ margin: "8px 0", color: "#6b7280" }}>
                          Size: {item.size || "N/A"} | Màu:{" "}
                          {item.color || "N/A"}
                        </p>

                        <p style={{ margin: 0 }}>
                          SL: <b>{item.qty}</b> ×{" "}
                          <b>{(item.price || 0).toLocaleString("vi-VN")}đ</b>
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </Space>
            ) : (
              <Empty description="Đơn hàng chưa có sản phẩm" />
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default AdminOrdersPage;
