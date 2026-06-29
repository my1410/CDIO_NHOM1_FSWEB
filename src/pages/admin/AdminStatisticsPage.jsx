import { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  message,
  Table,
  Tag,
  Progress,
  Space,
} from "antd";

import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreOutlined,
  WarningOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const AdminStatisticsPage = () => {
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    summary: {},
    orderStatus: {},
    revenueLast7Days: [],
    lowStockProducts: [],
    latestOrders: [],
  });

  const getAuthHeaders = () => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");
    const token = adminInfo?.token;

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/admin/statistics",
        getAuthHeaders(),
      );

      setStatistics(res.data || {});
    } catch (error) {
      console.log(error);
      message.error(
        error.response?.data?.message || "Không thể tải dữ liệu thống kê",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const getStatusTag = (status) => {
    switch (status) {
      case "pending":
        return <Tag color="default">Chờ xác nhận</Tag>;
      case "processing":
        return <Tag color="blue">Đang xử lý</Tag>;
      case "shipping":
        return <Tag color="purple">Đang giao</Tag>;
      case "delivered":
        return <Tag color="green">Đã giao</Tag>;
      case "cancelled":
        return <Tag color="red">Đã hủy</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const orderStatus = statistics.orderStatus || {};
  const totalStatusOrders =
    Number(orderStatus.pending || 0) +
    Number(orderStatus.processing || 0) +
    Number(orderStatus.shipping || 0) +
    Number(orderStatus.delivered || 0) +
    Number(orderStatus.cancelled || 0);

  const getPercent = (value) => {
    if (!totalStatusOrders) return 0;
    return Math.round((Number(value || 0) / totalStatusOrders) * 100);
  };

  const latestOrderColumns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "_id",
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
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
  ];

  const lowStockColumns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <Space>
          <img
            src={record.images?.[0] || "https://placehold.co/80x80"}
            alt={record.name}
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
            }}
          />

          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary">{record.category}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Text style={{ color: "#ef4444", fontWeight: 700 }}>
          {Number(price || 0).toLocaleString("vi-VN")}đ
        </Text>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "countInStock",
      key: "countInStock",
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: "Mức cảnh báo",
      dataIndex: "lowStockThreshold",
      key: "lowStockThreshold",
    },
  ];

  return (
    <div>
      <Title level={2}>
        <BarChartOutlined /> Thống kê hệ thống
      </Title>

      <Text type="secondary">
        Theo dõi doanh thu, đơn hàng, khách hàng, sản phẩm và tình trạng kho
        hàng trong hệ thống.
      </Text>

      <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} loading={loading} style={{ borderRadius: 18 }}>
            <Statistic
              title="Tổng doanh thu"
              value={statistics.summary?.totalRevenue || 0}
              suffix="đ"
              valueStyle={{ color: "#16a34a" }}
              prefix={<DollarOutlined />}
              formatter={(value) => Number(value).toLocaleString("vi-VN")}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} loading={loading} style={{ borderRadius: 18 }}>
            <Statistic
              title="Tổng đơn hàng"
              value={statistics.summary?.totalOrders || 0}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} loading={loading} style={{ borderRadius: 18 }}>
            <Statistic
              title="Tổng khách hàng"
              value={statistics.summary?.totalCustomers || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} loading={loading} style={{ borderRadius: 18 }}>
            <Statistic
              title="Tổng sản phẩm"
              value={statistics.summary?.totalProducts || 0}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title="Thống kê trạng thái đơn hàng"
            bordered={false}
            loading={loading}
            style={{ borderRadius: 18 }}
          >
            <div style={{ marginBottom: 18 }}>
              <Text>Chờ xác nhận</Text>
              <Progress
                percent={getPercent(orderStatus.pending)}
                status="normal"
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <Text>Đang xử lý</Text>
              <Progress
                percent={getPercent(orderStatus.processing)}
                status="active"
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <Text>Đang giao</Text>
              <Progress percent={getPercent(orderStatus.shipping)} />
            </div>

            <div style={{ marginBottom: 18 }}>
              <Text>Đã giao</Text>
              <Progress
                percent={getPercent(orderStatus.delivered)}
                status="success"
              />
            </div>

            <div>
              <Text>Đã hủy</Text>
              <Progress
                percent={getPercent(orderStatus.cancelled)}
                status="exception"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Doanh thu 7 ngày gần nhất"
            bordered={false}
            loading={loading}
            style={{ borderRadius: 18 }}
          >
            {(statistics.revenueLast7Days || []).length === 0 ? (
              <Text type="secondary">Chưa có dữ liệu doanh thu</Text>
            ) : (
              (statistics.revenueLast7Days || []).map((item) => (
                <div key={item._id} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <Text>{item._id}</Text>
                    <Text strong>
                      {Number(item.revenue || 0).toLocaleString("vi-VN")}đ
                    </Text>
                  </div>

                  <Progress
                    percent={Math.min(
                      100,
                      Math.round(
                        (Number(item.revenue || 0) /
                          Math.max(
                            ...statistics.revenueLast7Days.map((d) =>
                              Number(d.revenue || 0),
                            ),
                          )) *
                          100,
                      ),
                    )}
                    showInfo={false}
                  />
                </div>
              ))
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <WarningOutlined style={{ color: "#f59e0b" }} />
                Sản phẩm sắp hết hàng
              </Space>
            }
            bordered={false}
            loading={loading}
            style={{ borderRadius: 18 }}
          >
            <Table
              rowKey="_id"
              columns={lowStockColumns}
              dataSource={statistics.lowStockProducts || []}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Đơn hàng mới nhất"
            bordered={false}
            loading={loading}
            style={{ borderRadius: 18 }}
          >
            <Table
              rowKey="_id"
              columns={latestOrderColumns}
              dataSource={statistics.latestOrders || []}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 700 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminStatisticsPage;
