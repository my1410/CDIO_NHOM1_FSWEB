import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Statistic, Table, Tag, Typography, Spin } from "antd";
import {
  ShoppingOutlined,
  AppstoreOutlined,
  FireOutlined,
  StarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");

      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.log("Lỗi dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, item) => sum + (item.countInStock || 0),
    0,
  );
  const saleProducts = products.filter((item) => item.isSale).length;
  const avgRating =
    products.length > 0
      ? (
          products.reduce((sum, item) => sum + (item.rating || 0), 0) /
          products.length
        ).toFixed(1)
      : 0;

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (value) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (value) => `${value?.toLocaleString("vi-VN")}đ`,
    },
    {
      title: "Kho",
      dataIndex: "countInStock",
      key: "countInStock",
    },
    {
      title: "Sale",
      dataIndex: "isSale",
      key: "isSale",
      render: (value, record) =>
        value ? <Tag color="red">-{record.discount}%</Tag> : <Tag>Không</Tag>,
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <Title level={2} style={{ marginBottom: 6 }}>
          Dashboard
        </Title>
        <Text type="secondary">
          Tổng quan dữ liệu sản phẩm trong Fashion AI Store
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 20 }}>
            <Statistic
              title="Tổng sản phẩm"
              value={totalProducts}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 20 }}>
            <Statistic
              title="Tồn kho"
              value={totalStock}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 20 }}>
            <Statistic
              title="Đang sale"
              value={saleProducts}
              prefix={<FireOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 20 }}>
            <Statistic
              title="Rating trung bình"
              value={avgRating}
              prefix={<StarOutlined />}
              suffix="/ 5"
            />
          </Card>
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{
          marginTop: 30,
          borderRadius: 24,
        }}
      >
        <Title level={4}>Sản phẩm mới nhất</Title>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={products.slice(0, 8)}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
