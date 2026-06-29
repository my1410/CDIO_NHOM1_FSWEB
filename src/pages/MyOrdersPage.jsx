import { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Typography,
  message,
  Modal,
  Descriptions,
  List,
  Input,
} from "antd";

import {
  EyeOutlined,
  CloseCircleOutlined,
  ShoppingOutlined,
  CarOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelledReason, setCancelledReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("access_token") ||
      JSON.parse(localStorage.getItem("userInfo") || "{}")?.token;

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchMyOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/orders/myorders",
        getAuthHeaders(),
      );

      setOrders(res.data.orders || []);
    } catch (error) {
      console.log(error);
      message.error(
        error.response?.data?.message || "Không thể tải danh sách đơn hàng",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const getStatusTag = (status) => {
    switch (status) {
      case "pending":
        return <Tag color="default">Chờ xác nhận</Tag>;

      case "processing":
        return (
          <Tag color="blue" icon={<SyncOutlined />}>
            Đang xử lý
          </Tag>
        );

      case "shipping":
        return (
          <Tag color="purple" icon={<CarOutlined />}>
            Đang giao
          </Tag>
        );

      case "delivered":
        return (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Đã giao
          </Tag>
        );

      case "cancelled":
        return (
          <Tag color="red" icon={<CloseCircleOutlined />}>
            Đã hủy
          </Tag>
        );

      default:
        return <Tag>{status}</Tag>;
    }
  };

  const canCancelOrder = (status) => {
    return status === "pending" || status === "processing";
  };

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setCancelledReason("");
    setCancelOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!cancelledReason.trim()) {
      message.warning("Vui lòng nhập lý do hủy đơn");
      return;
    }

    try {
      setCancelLoading(true);

      const res = await axios.put(
        `http://localhost:5000/api/orders/${selectedOrder._id}/cancel`,
        {
          cancelledReason: cancelledReason.trim(),
        },
        getAuthHeaders(),
      );

      message.success(res.data.message || "Hủy đơn hàng thành công");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === selectedOrder._id ? res.data.order : order,
        ),
      );

      setSelectedOrder(res.data.order);
      setCancelOpen(false);
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Không thể hủy đơn hàng");
    } finally {
      setCancelLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <Text copyable>{id}</Text>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => (
        <Text strong style={{ color: "#ef4444" }}>
          {Number(price || 0).toLocaleString("vi-VN")}đ
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Mã vận đơn",
      dataIndex: "trackingNumber",
      key: "trackingNumber",
      render: (trackingNumber) => trackingNumber || "Chưa có",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space wrap>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              setDetailOpen(true);
            }}
          >
            Chi tiết
          </Button>

          {canCancelOrder(record.status) && (
            <Button danger onClick={() => openCancelModal(record)}>
              Hủy đơn
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <Title level={2}>
        <ShoppingOutlined /> Đơn hàng của tôi
      </Title>

      <Text type="secondary">
        Theo dõi trạng thái đơn hàng, xem chi tiết đơn và hủy đơn khi còn đủ
        điều kiện.
      </Text>

      <Card
        bordered={false}
        style={{
          marginTop: 24,
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
        }}
      >
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={orders}
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 900 }}
        />
      </Card>

      <Modal
        title="Chi tiết đơn hàng"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Mã đơn">
                <Text copyable>{selectedOrder._id}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày đặt">
                {selectedOrder.createdAt
                  ? new Date(selectedOrder.createdAt).toLocaleString("vi-VN")
                  : ""}
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                {getStatusTag(selectedOrder.status)}
              </Descriptions.Item>

              <Descriptions.Item label="Mã vận đơn">
                {selectedOrder.trackingNumber || "Chưa có"}
              </Descriptions.Item>

              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.shippingAddress?.phone}
              </Descriptions.Item>

              <Descriptions.Item label="Địa chỉ giao hàng">
                {selectedOrder.shippingAddress?.address}
              </Descriptions.Item>

              <Descriptions.Item label="Tổng tiền">
                <Text strong style={{ color: "#ef4444" }}>
                  {Number(selectedOrder.totalPrice || 0).toLocaleString(
                    "vi-VN",
                  )}
                  đ
                </Text>
              </Descriptions.Item>

              {selectedOrder.status === "cancelled" && (
                <Descriptions.Item label="Lý do hủy">
                  {selectedOrder.cancelledReason || "Không có"}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Title level={4} style={{ marginTop: 24 }}>
              Sản phẩm trong đơn
            </Title>

            <List
              bordered
              dataSource={selectedOrder.orderItems || []}
              renderItem={(item) => (
                <List.Item>
                  <Space>
                    <img
                      src={item.image || "https://placehold.co/80x80"}
                      alt={item.name}
                      style={{
                        width: 70,
                        height: 70,
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid #e5e7eb",
                      }}
                    />

                    <div>
                      <Text strong>{item.name}</Text>
                      <br />
                      <Text type="secondary">
                        Số lượng: {item.qty} | Size: {item.size || "Không"} |
                        Màu: {item.color || "Không"}
                      </Text>
                      <br />
                      <Text strong>
                        {Number(item.price || 0).toLocaleString("vi-VN")}đ
                      </Text>
                    </div>
                  </Space>
                </List.Item>
              )}
            />

            {canCancelOrder(selectedOrder.status) && (
              <Button
                danger
                style={{ marginTop: 20 }}
                onClick={() => openCancelModal(selectedOrder)}
              >
                Hủy đơn hàng
              </Button>
            )}
          </>
        )}
      </Modal>

      <Modal
        title="Xác nhận hủy đơn hàng"
        open={cancelOpen}
        onCancel={() => setCancelOpen(false)}
        onOk={handleCancelOrder}
        confirmLoading={cancelLoading}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        okButtonProps={{ danger: true }}
      >
        <Text>
          Bạn có chắc chắn muốn hủy đơn hàng này không? Sau khi hủy, đơn hàng sẽ
          không tiếp tục được xử lý.
        </Text>

        <div style={{ marginTop: 16 }}>
          <Text strong>Lý do hủy đơn</Text>

          <TextArea
            rows={4}
            value={cancelledReason}
            onChange={(e) => setCancelledReason(e.target.value)}
            placeholder="Nhập lý do hủy đơn..."
            style={{ marginTop: 8 }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default MyOrdersPage;
