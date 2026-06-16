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
  Input,
  Descriptions,
  List,
  Popconfirm,
  Row,
  Col,
  Statistic,
} from "antd";

import {
  ShoppingCartOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CarOutlined,
  StopOutlined,
  EyeOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [shippingOpen, setShippingOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelledReason, setCancelledReason] = useState("");

  const [actionLoading, setActionLoading] = useState("");

  const getAuthHeaders = () => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");
    const token = adminInfo?.token;

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/orders",
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
    fetchOrders();
  }, []);

  const updateOrderInList = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order,
      ),
    );

    setSelectedOrder(updatedOrder);
  };

  const handleConfirmOrder = async (order) => {
    try {
      setActionLoading(order._id);

      const res = await axios.put(
        `http://localhost:5000/api/orders/${order._id}/confirm`,
        {},
        getAuthHeaders(),
      );

      message.success(res.data.message || "Đã xác nhận đơn hàng");
      updateOrderInList(res.data.order);
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Không thể xác nhận đơn");
    } finally {
      setActionLoading("");
    }
  };

  const openShippingModal = (order) => {
    setSelectedOrder(order);
    setTrackingNumber(order.trackingNumber || "");
    setShippingOpen(true);
  };

  const handleShippingOrder = async () => {
    if (!trackingNumber.trim()) {
      message.warning("Vui lòng nhập mã vận đơn");
      return;
    }

    try {
      setActionLoading(selectedOrder._id);

      const res = await axios.put(
        `http://localhost:5000/api/orders/${selectedOrder._id}/status`,
        {
          status: "shipping",
          trackingNumber: trackingNumber.trim(),
        },
        getAuthHeaders(),
      );

      message.success("Đã cập nhật đơn hàng sang trạng thái đang giao");
      updateOrderInList(res.data.order);
      setShippingOpen(false);
    } catch (error) {
      console.log(error);
      message.error(
        error.response?.data?.message || "Không thể cập nhật trạng thái",
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleDeliveredOrder = async (order) => {
    try {
      setActionLoading(order._id);

      const res = await axios.put(
        `http://localhost:5000/api/orders/${order._id}/status`,
        {
          status: "delivered",
        },
        getAuthHeaders(),
      );

      message.success("Đã cập nhật đơn hàng đã giao");
      updateOrderInList(res.data.order);
    } catch (error) {
      console.log(error);
      message.error(
        error.response?.data?.message || "Không thể cập nhật đã giao",
      );
    } finally {
      setActionLoading("");
    }
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
      setActionLoading(selectedOrder._id);

      const res = await axios.put(
        `http://localhost:5000/api/orders/${selectedOrder._id}/status`,
        {
          status: "cancelled",
          cancelledReason: cancelledReason.trim(),
        },
        getAuthHeaders(),
      );

      message.success("Đã hủy đơn hàng");
      updateOrderInList(res.data.order);
      setCancelOpen(false);
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Không thể hủy đơn hàng");
    } finally {
      setActionLoading("");
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "pending":
        return <Tag color="default">Chờ duyệt</Tag>;
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
        return <Tag>{status || "pending"}</Tag>;
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (item) => item.status === "pending",
  ).length;
  const shippingOrders = orders.filter(
    (item) => item.status === "shipping",
  ).length;
  const deliveredOrders = orders.filter(
    (item) => item.status === "delivered",
  ).length;

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "_id",
      width: 180,
      render: (id) => <Text copyable>{id}</Text>,
    },
    {
      title: "Khách hàng",
      key: "user",
      render: (_, record) => (
        <div>
          <Text strong>{record.user?.name || "Khách hàng"}</Text>
          <br />
          <Text type="secondary">{record.user?.email || ""}</Text>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      key: "items",
      render: (_, record) => (
        <div>
          {(record.orderItems || []).slice(0, 2).map((item, index) => (
            <div key={index}>
              {item.name} x{item.qty}
            </div>
          ))}

          {(record.orderItems || []).length > 2 && (
            <Text type="secondary">
              +{record.orderItems.length - 2} sản phẩm khác
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 140,
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
      width: 140,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Mã vận đơn",
      dataIndex: "trackingNumber",
      key: "trackingNumber",
      width: 150,
      render: (trackingNumber) => trackingNumber || "Chưa có",
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "Hành động",
      key: "action",
      width: 300,
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

          {record.status === "pending" && (
            <Popconfirm
              title="Xác nhận đơn hàng?"
              description="Hệ thống sẽ tự động trừ tồn kho sau khi xác nhận."
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={() => handleConfirmOrder(record)}
            >
              <Button
                type="primary"
                loading={actionLoading === record._id}
                icon={<CheckCircleOutlined />}
              >
                Xác nhận
              </Button>
            </Popconfirm>
          )}

          {record.status === "processing" && (
            <Button
              type="primary"
              icon={<CarOutlined />}
              loading={actionLoading === record._id}
              onClick={() => openShippingModal(record)}
            >
              Đang giao
            </Button>
          )}

          {record.status === "shipping" && (
            <Popconfirm
              title="Xác nhận đơn đã giao?"
              okText="Đã giao"
              cancelText="Hủy"
              onConfirm={() => handleDeliveredOrder(record)}
            >
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={actionLoading === record._id}
              >
                Đã giao
              </Button>
            </Popconfirm>
          )}

          {!["delivered", "cancelled"].includes(record.status) && (
            <Button
              danger
              icon={<StopOutlined />}
              onClick={() => openCancelModal(record)}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Quản lý đơn hàng</Title>

      <Text type="secondary">
        Xác nhận đơn hàng, cập nhật mã vận đơn, trạng thái giao hàng và tự động
        trừ/cộng lại kho khi xử lý đơn.
      </Text>

      <Row gutter={[20, 20]} style={{ marginTop: 24, marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 18 }}>
            <Statistic
              title="Tổng đơn"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 18 }}>
            <Statistic
              title="Chờ duyệt"
              value={pendingOrders}
              valueStyle={{ color: "#f59e0b" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 18 }}>
            <Statistic
              title="Đang giao"
              value={shippingOrders}
              valueStyle={{ color: "#7c3aed" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 18 }}>
            <Statistic
              title="Đã giao"
              value={deliveredOrders}
              valueStyle={{ color: "#16a34a" }}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 20 }}>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={orders}
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1500 }}
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

              <Descriptions.Item label="Khách hàng">
                {selectedOrder.user?.name || "Khách hàng"}
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                {selectedOrder.user?.email || ""}
              </Descriptions.Item>

              <Descriptions.Item label="SĐT giao hàng">
                {selectedOrder.shippingAddress?.phone}
              </Descriptions.Item>

              <Descriptions.Item label="Địa chỉ">
                {selectedOrder.shippingAddress?.address}
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                {getStatusTag(selectedOrder.status)}
              </Descriptions.Item>

              <Descriptions.Item label="Mã vận đơn">
                {selectedOrder.trackingNumber || "Chưa có"}
              </Descriptions.Item>

              <Descriptions.Item label="Tổng tiền">
                <Text strong style={{ color: "#ef4444" }}>
                  {Number(selectedOrder.totalPrice || 0).toLocaleString(
                    "vi-VN",
                  )}
                  đ
                </Text>
              </Descriptions.Item>
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
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />

                    <div>
                      <Text strong>{item.name}</Text>
                      <br />
                      <Text type="secondary">
                        SL: {item.qty} | Size: {item.size || "Không"} | Màu:{" "}
                        {item.color || "Không"}
                      </Text>
                    </div>
                  </Space>
                </List.Item>
              )}
            />
          </>
        )}
      </Modal>

      <Modal
        title="Cập nhật mã vận đơn"
        open={shippingOpen}
        onCancel={() => setShippingOpen(false)}
        onOk={handleShippingOrder}
        confirmLoading={actionLoading === selectedOrder?._id}
        okText="Cập nhật đang giao"
        cancelText="Hủy"
      >
        <Text strong>Mã vận đơn</Text>

        <Input
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Ví dụ: GHN123456789"
          style={{ marginTop: 8 }}
        />
      </Modal>

      <Modal
        title="Hủy đơn hàng"
        open={cancelOpen}
        onCancel={() => setCancelOpen(false)}
        onOk={handleCancelOrder}
        confirmLoading={actionLoading === selectedOrder?._id}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        okButtonProps={{ danger: true }}
      >
        <Text strong>Lý do hủy đơn</Text>

        <TextArea
          rows={4}
          value={cancelledReason}
          onChange={(e) => setCancelledReason(e.target.value)}
          placeholder="Nhập lý do hủy đơn..."
          style={{ marginTop: 8 }}
        />
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
