import { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  Table,
  Button,
  Input,
  InputNumber,
  Select,
  Tag,
  Space,
  Typography,
  message,
  Row,
  Col,
  Statistic,
  Modal,
  Alert,
  Tabs,
} from "antd";

import {
  InboxOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  StopOutlined,
  PlusOutlined,
  MinusOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

const AdminInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [productId, setProductId] = useState("");
  const [type, setType] = useState("import");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");

  const getAuthHeaders = () => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");
    const token = adminInfo?.token;

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/admin/inventory",
        getAuthHeaders(),
      );

      setProducts(res.data.products || []);
      setSummary(res.data.summary || {});
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Không thể tải kho hàng");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/inventory/transactions",
        getAuthHeaders(),
      );

      setTransactions(res.data.transactions || []);
    } catch (error) {
      console.log(error);
      message.error(
        error.response?.data?.message || "Không thể tải lịch sử kho",
      );
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchTransactions();
  }, []);

  const openTransactionModal = (product = null, defaultType = "import") => {
    setProductId(product?._id || "");
    setType(defaultType);
    setQuantity(1);
    setReason("");
    setTransactionOpen(true);
  };

  const handleCreateTransaction = async () => {
    if (!productId) {
      message.warning("Vui lòng chọn sản phẩm");
      return;
    }

    if (quantity < 0) {
      message.warning("Số lượng không hợp lệ");
      return;
    }

    try {
      setSaving(true);

      const res = await axios.post(
        "http://localhost:5000/api/admin/inventory/transactions",
        {
          productId,
          type,
          quantity,
          reason,
        },
        getAuthHeaders(),
      );

      message.success(res.data.message || "Tạo phiếu kho thành công");

      setTransactionOpen(false);
      fetchInventory();
      fetchTransactions();
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Không thể tạo phiếu kho");
    } finally {
      setSaving(false);
    }
  };

  const getStockStatus = (record) => {
    if (record.isOutOfStock) {
      return (
        <Tag color="red" icon={<StopOutlined />}>
          Hết hàng
        </Tag>
      );
    }

    if (record.isLowStock) {
      return (
        <Tag color="orange" icon={<WarningOutlined />}>
          Sắp hết
        </Tag>
      );
    }

    return (
      <Tag color="green" icon={<CheckCircleOutlined />}>
        Còn hàng
      </Tag>
    );
  };

  const getTransactionTypeTag = (value) => {
    if (value === "import") {
      return (
        <Tag color="green" icon={<PlusOutlined />}>
          Nhập kho
        </Tag>
      );
    }

    if (value === "export") {
      return (
        <Tag color="red" icon={<MinusOutlined />}>
          Xuất kho
        </Tag>
      );
    }

    return (
      <Tag color="blue" icon={<EditOutlined />}>
        Điều chỉnh
      </Tag>
    );
  };

  const lowStockProducts = products.filter(
    (product) => product.isLowStock || product.isOutOfStock,
  );

  const productColumns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => {
        const imageUrl =
          record.images?.[0] || "https://placehold.co/100x100?text=Fashion";

        return (
          <Space>
            <img
              src={imageUrl}
              alt={record.name}
              style={{
                width: 58,
                height: 58,
                objectFit: "cover",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
              }}
            />

            <div>
              <Text strong>{record.name}</Text>
              <br />
              <Text type="secondary">{record.category}</Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 130,
      render: (price) => (
        <Text strong style={{ color: "#ef4444" }}>
          {Number(price || 0).toLocaleString("vi-VN")}đ
        </Text>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "countInStock",
      key: "countInStock",
      width: 120,
      render: (stock) => <Text strong>{stock || 0}</Text>,
    },
    {
      title: "Mức cảnh báo",
      dataIndex: "lowStockThreshold",
      key: "lowStockThreshold",
      width: 140,
      render: (value) => value || 5,
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 140,
      render: (_, record) => getStockStatus(record),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 260,
      render: (_, record) => (
        <Space wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openTransactionModal(record, "import")}
          >
            Nhập
          </Button>

          <Button
            icon={<MinusOutlined />}
            onClick={() => openTransactionModal(record, "export")}
          >
            Xuất
          </Button>

          <Button
            icon={<EditOutlined />}
            onClick={() => openTransactionModal(record, "adjust")}
          >
            Điều chỉnh
          </Button>
        </Space>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => record.product?.name || "Không rõ",
    },
    {
      title: "Loại phiếu",
      dataIndex: "type",
      key: "type",
      render: (value) => getTransactionTypeTag(value),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tồn cũ",
      dataIndex: "oldStock",
      key: "oldStock",
    },
    {
      title: "Tồn mới",
      dataIndex: "newStock",
      key: "newStock",
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      render: (value) => value || "Không có",
    },
    {
      title: "Người tạo",
      key: "createdBy",
      render: (_, record) => record.createdBy?.name || "Admin",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleString("vi-VN") : ""),
    },
  ];

  return (
    <div>
      <Title level={2}>Quản lý kho hàng</Title>

      <Text type="secondary">
        Theo dõi tồn kho, cảnh báo sản phẩm sắp hết hàng và tạo phiếu nhập/xuất
        kho thủ công.
      </Text>

      <Row gutter={[20, 20]} style={{ marginTop: 24, marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 18 }}>
            <Statistic
              title="Tổng sản phẩm"
              value={summary.totalProducts || 0}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 18 }}>
            <Statistic
              title="Tổng tồn kho"
              value={summary.totalStock || 0}
              valueStyle={{ color: "#16a34a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 18 }}>
            <Statistic
              title="Sắp hết hàng"
              value={summary.lowStockCount || 0}
              valueStyle={{ color: "#f59e0b" }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 18 }}>
            <Statistic
              title="Hết hàng"
              value={summary.outOfStockCount || 0}
              valueStyle={{ color: "#dc2626" }}
              prefix={<StopOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {lowStockProducts.length > 0 && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 24, borderRadius: 12 }}
          message="Cảnh báo tồn kho"
          description={`Có ${lowStockProducts.length} sản phẩm đang sắp hết hoặc hết hàng. Vui lòng nhập thêm hàng để đảm bảo hoạt động bán hàng.`}
        />
      )}

      <Card bordered={false} style={{ borderRadius: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Quản lý tồn kho
          </Title>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openTransactionModal(null, "import")}
          >
            Tạo phiếu kho
          </Button>
        </div>

        <Tabs
          items={[
            {
              key: "products",
              label: "Danh sách tồn kho",
              children: (
                <Table
                  rowKey="_id"
                  columns={productColumns}
                  dataSource={products}
                  loading={loading}
                  pagination={{ pageSize: 8 }}
                  scroll={{ x: 1100 }}
                />
              ),
            },
            {
              key: "transactions",
              label: "Lịch sử nhập/xuất kho",
              children: (
                <Table
                  rowKey="_id"
                  columns={transactionColumns}
                  dataSource={transactions}
                  pagination={{ pageSize: 8 }}
                  scroll={{ x: 1200 }}
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="Tạo phiếu nhập/xuất kho"
        open={transactionOpen}
        onCancel={() => setTransactionOpen(false)}
        onOk={handleCreateTransaction}
        confirmLoading={saving}
        okText="Lưu phiếu"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Sản phẩm</Text>

          <Select
            showSearch
            value={productId || undefined}
            placeholder="Chọn sản phẩm"
            onChange={(value) => setProductId(value)}
            style={{ width: "100%", marginTop: 8 }}
            optionFilterProp="label"
            options={products.map((product) => ({
              value: product._id,
              label: `${product.name} - Tồn: ${product.countInStock || 0}`,
            }))}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Loại phiếu</Text>

          <Select
            value={type}
            onChange={(value) => setType(value)}
            style={{ width: "100%", marginTop: 8 }}
            options={[
              {
                value: "import",
                label: "Nhập kho",
              },
              {
                value: "export",
                label: "Xuất kho",
              },
              {
                value: "adjust",
                label: "Điều chỉnh tồn kho",
              },
            ]}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>{type === "adjust" ? "Tồn kho mới" : "Số lượng"}</Text>

          <InputNumber
            min={0}
            value={quantity}
            onChange={(value) => setQuantity(value || 0)}
            style={{ width: "100%", marginTop: 8 }}
          />
        </div>

        <div>
          <Text strong>Lý do</Text>

          <TextArea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do nhập/xuất/điều chỉnh kho..."
            style={{ marginTop: 8 }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AdminInventoryPage;
